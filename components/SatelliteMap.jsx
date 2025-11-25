import { Card, CardHeader, CardContent } from './ui/card';
import { useState, useEffect } from 'react';

export const SatelliteMap = ({ weatherData, userLocation }) => {
  const [userCoords, setUserCoords] = useState(null);
  const [locationAccess, setLocationAccess] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Get user's actual location with better error handling
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setLocationError('');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        setLocationAccess(true);
      },
      (error) => {
        console.log('Location access details:', error);
        setLocationAccess(false);
        
        // Use weather data coordinates as fallback
        if (weatherData.coord) {
          setUserCoords({
            lat: weatherData.coord.lat,
            lon: weatherData.coord.lon
          });
        }
        
        // Set specific error messages
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access was denied. Using city coordinates instead.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable. Using city coordinates.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Using city coordinates.');
            break;
          default:
            setLocationError('An unknown error occurred. Using city coordinates.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, [weatherData]);

  // Use weather data coordinates if no user location
  useEffect(() => {
    if (!userCoords && weatherData.coord) {
      setUserCoords({
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon
      });
    }
  }, [weatherData, userCoords]);

  // Generate realistic weather visualization
  const generateWeatherVisualization = () => {
    const condition = weatherData.weather[0].main.toLowerCase();
    
    const visualConfigs = {
      clear: {
        baseColor: 'from-blue-400 to-blue-600',
        elements: 2,
        elementType: 'sun',
      },
      clouds: {
        baseColor: 'from-gray-300 to-gray-500', 
        elements: 6,
        elementType: 'cloud',
      },
      rain: {
        baseColor: 'from-gray-400 to-gray-700',
        elements: 8,
        elementType: 'rain',
      },
      thunderstorm: {
        baseColor: 'from-gray-600 to-gray-900',
        elements: 4,
        elementType: 'lightning',
      },
      snow: {
        baseColor: 'from-gray-200 to-gray-400',
        elements: 12,
        elementType: 'snow',
      },
    };

    return visualConfigs[condition] || visualConfigs.clouds;
  };

  const visualConfig = generateWeatherVisualization();
  const coords = userCoords;

  const renderWeatherElements = () => {
    if (!visualConfig) return null;
    
    const elements = [];
    
    for (let i = 0; i < visualConfig.elements; i++) {
      if (visualConfig.elementType === 'cloud') {
        elements.push(
          <div
            key={`cloud-${i}`}
            className="absolute bg-white/60 rounded-full filter blur-sm"
            style={{
              width: `${40 + Math.random() * 60}px`,
              height: `${25 + Math.random() * 35}px`,
              top: `${10 + Math.random() * 70}%`,
              left: `${10 + Math.random() * 70}%`,
            }}
          />
        );
      }
    }
    
    return elements;
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🛰️</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Live Weather Map</h2>
              <p className="text-gray-600">Interactive satellite visualization</p>
            </div>
          </div>
          <button 
            onClick={getUserLocation}
            className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
          >
            <span>📍</span>
            {locationAccess ? 'Update Location' : 'Get My Location'}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100">
          
          {locationError && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-700 text-sm">{locationError}</p>
            </div>
          )}

          {/* Interactive Map Container */}
          <div className={`aspect-video bg-gradient-to-br ${visualConfig.baseColor} rounded-xl relative overflow-hidden mb-6 border-2 border-white/30 shadow-inner`}>
            
            {/* Radar Grid */}
            <div className="absolute inset-0 opacity-30">
              {[25, 50, 75].map(pos => (
                <div key={`h-${pos}`} className="absolute left-0 right-0 h-px bg-white/40" style={{ top: `${pos}%` }} />
              ))}
              {[25, 50, 75].map(pos => (
                <div key={`v-${pos}`} className="absolute top-0 bottom-0 w-px bg-white/40" style={{ left: `${pos}%` }} />
              ))}
            </div>

            {/* Radar Sweep */}
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-1/2 w-0 h-0 border-r-[100px] border-r-transparent border-l-[100px] border-l-transparent border-b-[200px] border-b-green-300/20 transform -translate-x-1/2 -translate-y-1/2 animate-radar-sweep"></div>
            </div>

            {/* Weather Elements */}
            {renderWeatherElements()}

            {/* Location Marker */}
            {coords && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                  <div className="absolute -inset-2 bg-red-500/20 rounded-full animate-ping"></div>
                </div>
              </div>
            )}

            {/* Weather Info Overlay */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {weatherData.weather[0].main === 'Clear' ? '☀️' :
                   weatherData.weather[0].main === 'Clouds' ? '☁️' :
                   weatherData.weather[0].main === 'Rain' ? '🌧️' : '🌤️'}
                </span>
                <div>
                  <div className="font-semibold text-sm">{weatherData.name}</div>
                  <div className="text-xs opacity-80 capitalize">{weatherData.weather[0].description}</div>
                </div>
              </div>
            </div>

            {/* Coordinates Display */}
            {coords && (
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-xs">
                <div>Lat: {coords.lat.toFixed(4)}°</div>
                <div>Lon: {coords.lon.toFixed(4)}°</div>
                <div className="opacity-70">{locationAccess ? 'Your Location' : 'City Center'}</div>
              </div>
            )}

            {/* Central Info */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="text-3xl mb-2">📡</div>
                <p className="text-white font-semibold text-sm">Live Weather Radar</p>
                <p className="text-white/80 text-xs mt-1">Tracking: {weatherData.name}</p>
              </div>
            </div>
          </div>

          {/* Weather Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-2xl mb-2">💨</div>
              <p className="font-semibold text-gray-800">Wind Speed</p>
              <p className="text-lg font-bold text-blue-600">{weatherData.wind.speed} m/s</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="text-2xl mb-2">☁️</div>
              <p className="font-semibold text-gray-800">Conditions</p>
              <p className="text-lg font-bold text-purple-600 capitalize">{weatherData.weather[0].description}</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="text-2xl mb-2">👁️</div>
              <p className="font-semibold text-gray-800">Visibility</p>
              <p className="text-lg font-bold text-green-600">
                {weatherData.visibility ? `${(weatherData.visibility / 1000).toFixed(1)} km` : 'Good'}
              </p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="text-2xl mb-2">🎯</div>
              <p className="font-semibold text-gray-800">Location</p>
              <p className="text-lg font-bold text-orange-600">
                {locationAccess ? 'GPS Active' : 'City Data'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};