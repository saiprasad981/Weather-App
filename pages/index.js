import { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { WeatherCard } from '../components/WeatherCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { HistoryPanel } from '../components/HistoryPanel';
import { AIWeatherSummary } from '../components/AIWeatherSummary';
import { HealthInsights } from '../components/HealthInsights';
import { ClothingRecommendation } from '../components/ClothingRecommendation';
import { SatelliteMap } from '../components/SatelliteMap';
import { WeatherTimeline } from '../components/WeatherTimeline';
import { AuthForm } from '../components/AuthForm';
import { Card, CardHeader, CardContent } from '../components/ui/card';

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [activeFeature, setActiveFeature] = useState('current');
  const [aiSummary, setAiSummary] = useState('');
  const [healthData, setHealthData] = useState(null);
  const [clothingRec, setClothingRec] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    setIsClient(true);
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('weatherUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        if (userData.id) {
          loadSearchHistory(userData.id);
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('weatherUser');
      }
    }
  }, []);

  const loadSearchHistory = async (userId) => {
    if (!userId) {
      console.log('No user ID provided for loading history');
      return;
    }
    
    try {
      console.log('Loading history for user:', userId);
      const response = await fetch(`/api/history?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('History loaded:', data.history);
        setSearchHistory(data.history || []);
      } else {
        const errorData = await response.json();
        console.error('Failed to load history:', errorData);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const saveToHistory = async (city, weatherData) => {
    if (!user || !user.id) {
      console.log('No user logged in, skipping history save');
      return;
    }
    
    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          city,
          temperature: weatherData.main.temp,
          condition: weatherData.weather[0].main,
        }),
      });
      
      if (response.ok) {
        console.log('History saved successfully');
        loadSearchHistory(user.id); // Reload to get updated history
      } else {
        const errorData = await response.json();
        console.error('Failed to save history:', errorData);
      }
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  };

  const fetchAIData = async (city, weatherData) => {
    try {
      const [summaryRes, healthRes, clothingRes] = await Promise.all([
        fetch('/api/ai-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city, weather: weatherData, userId: user?.id })
        }),
        fetch('/api/health-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ weather: weatherData })
        }),
        fetch('/api/clothing-recommendation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ weather: weatherData })
        })
      ]);

      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        setAiSummary(summaryData.summary);
      } else {
        console.error('AI Summary failed:', await summaryRes.json());
      }

      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setHealthData(healthData);
      } else {
        console.error('Health insights failed:', await healthRes.json());
      }

      if (clothingRes.ok) {
        const clothingData = await clothingRes.json();
        setClothingRec(clothingData.recommendation);
      } else {
        console.error('Clothing recommendation failed:', await clothingRes.json());
      }
    } catch (error) {
      console.error('Failed to fetch AI data:', error);
    }
  };

  const handleSearch = async (city) => {
    setLoading(true);
    setError('');
    setWeatherData(null);
    setAiSummary('');
    setHealthData(null);
    setClothingRec('');
    
    try {
      console.log('Searching for city:', city);
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json();
      
      console.log('Weather API response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      if (data && data.name) {
        setWeatherData(data);
        await saveToHistory(city, data);
        await fetchAIData(city, data);
      } else {
        throw new Error('Invalid weather data received');
      }
      
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!user || !user.id) return;
    
    try {
      const response = await fetch('/api/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      
      if (response.ok) {
        setSearchHistory([]);
        setShowHistory(false);
        console.log('History cleared successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to clear history:', errorData);
      }
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const handleLogin = (userData) => {
    console.log('User logged in:', userData);
    setUser(userData);
    localStorage.setItem('weatherUser', JSON.stringify(userData));
    if (userData.id) {
      loadSearchHistory(userData.id);
    }
    setShowAuth(false);
  };

  const handleLogout = () => {
    console.log('User logging out');
    setUser(null);
    setSearchHistory([]);
    setWeatherData(null);
    localStorage.removeItem('weatherUser');
    setShowHistory(false);
  };

  const getCurrentDate = () => {
    if (!isClient) return '';
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const FeatureButton = ({ feature, icon, label, isActive }) => (
    <button
      onClick={() => setActiveFeature(feature)}
      className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
        isActive 
          ? 'bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg' 
          : 'bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15'
      }`}
    >
      <span className="text-2xl mb-2">{icon}</span>
      <span className="text-sm font-medium text-white">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 py-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with User Info */}
        <Card className="max-w-6xl mx-auto mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-between items-center mb-4">
              <div></div> {/* Empty div for spacing */}
              <div className="text-center flex-1">
                <p className="text-sm text-gray-600 font-medium">{getCurrentDate()}</p>
              </div>
              <div>
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 hidden sm:inline">Welcome, {user.name}</span>
                    <button 
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowAuth(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors shadow-lg"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              🌤️ WeatherAI Pro
            </h1>
            <p className="text-lg text-gray-600">
              {user ? `Welcome back, ${user.name}!` : 'Next-gen weather intelligence with AI-powered insights'}
            </p>
          </CardHeader>
        </Card>

        {/* Auth Modal */}
        {showAuth && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md">
              <AuthForm 
                onLogin={handleLogin} 
                onClose={() => setShowAuth(false)} 
              />
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
          
          {/* Action Buttons */}
          <div className="flex gap-3 justify-center mt-4 flex-wrap">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              disabled={!user}
              className="flex items-center gap-2 bg-white/90 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl border-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>📚</span>
              {showHistory ? 'Hide History' : 'Show History'}
              {!user && ' (Login Required)'}
            </button>
            
            {user && searchHistory.length > 0 && (
              <button 
                onClick={clearHistory}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl border-0"
              >
                <span>🗑️</span>
                Clear History
              </button>
            )}
          </div>

          {!user && (
            <div className="text-center mt-4">
              <p className="text-white/80 text-sm">
                🔐 <button 
                  onClick={() => setShowAuth(true)}
                  className="underline hover:text-white transition-colors font-semibold"
                >
                  Login or Sign up
                </button> to save your search history and get personalized features
              </p>
            </div>
          )}
        </div>

        {/* History Panel */}
        {showHistory && user && (
          <HistoryPanel 
            history={searchHistory} 
            onSearch={handleSearch}
            onClose={() => setShowHistory(false)}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
              <LoadingSpinner />
              <p className="text-gray-700 mt-4 text-lg font-semibold">Fetching advanced weather data...</p>
              <p className="text-gray-500 text-sm">Powered by AI & Real-time APIs</p>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <Card className="max-w-2xl mx-auto bg-red-50/90 backdrop-blur-sm border-red-200">
            <CardContent>
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🌧️</div>
                <p className="text-lg font-semibold text-red-700">{error}</p>
                <p className="text-red-600 mt-2">Please check the city name and try again</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feature Navigation */}
        {weatherData && !loading && (
          <div className="max-w-6xl mx-auto mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <FeatureButton 
                feature="current" 
                icon="🌡️" 
                label="Current" 
                isActive={activeFeature === 'current'} 
              />
              <FeatureButton 
                feature="ai" 
                icon="🤖" 
                label="AI Summary" 
                isActive={activeFeature === 'ai'} 
              />
              <FeatureButton 
                feature="health" 
                icon="❤️" 
                label="Health" 
                isActive={activeFeature === 'health'} 
              />
              <FeatureButton 
                feature="clothing" 
                icon="👕" 
                label="Clothing" 
                isActive={activeFeature === 'clothing'} 
              />
              <FeatureButton 
                feature="satellite" 
                icon="🛰️" 
                label="Satellite" 
                isActive={activeFeature === 'satellite'} 
              />
              <FeatureButton 
                feature="timeline" 
                icon="📊" 
                label="Timeline" 
                isActive={activeFeature === 'timeline'} 
              />
            </div>
          </div>
        )}

        {/* Feature Content */}
        {weatherData && !loading && (
          <div className="max-w-6xl mx-auto">
            {activeFeature === 'current' && (
              <div className="animate-fade-in">
                <WeatherCard weatherData={weatherData} />
                <p className="text-center text-white/90 mt-4 text-sm font-medium">
                  ✅ Live data from OpenWeatherMap • Updated just now
                </p>
              </div>
            )}

            {activeFeature === 'ai' && aiSummary && (
              <AIWeatherSummary summary={aiSummary} weatherData={weatherData} />
            )}

            {activeFeature === 'health' && healthData && (
              <HealthInsights healthData={healthData} weatherData={weatherData} />
            )}

            {activeFeature === 'clothing' && clothingRec && (
              <ClothingRecommendation recommendation={clothingRec} weatherData={weatherData} />
            )}

            {activeFeature === 'satellite' && (
              <SatelliteMap weatherData={weatherData} userLocation={user?.location} />
            )}

            {activeFeature === 'timeline' && (
              <WeatherTimeline weatherData={weatherData} />
            )}
          </div>
        )}

        {/* Features Showcase - Only show when no data is loaded */}
        {!weatherData && !loading && !error && !showHistory && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">✨ Next-Gen Weather Features</h2>
              <p className="text-white/80 text-lg">Experience weather forecasting powered by AI and real-time intelligence</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="text-center p-6">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800">AI Weather Summary</h3>
                  <p className="text-gray-600">Intelligent, human-readable weather insights and recommendations</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="text-center p-6">
                  <div className="text-4xl mb-4">❤️</div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800">Health Insights</h3>
                  <p className="text-gray-600">UV protection, allergy alerts, and health safety recommendations</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="text-center p-6">
                  <div className="text-4xl mb-4">👕</div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800">Smart Clothing</h3>
                  <p className="text-gray-600">AI-powered outfit recommendations based on weather conditions</p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="text-center p-6">
                  <div className="text-4xl mb-4">🛰️</div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800">Live Satellite</h3>
                  <p className="text-gray-600">Real-time satellite imagery and weather patterns</p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="text-center p-6">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800">Smart Timeline</h3>
                  <p className="text-gray-600">Interactive hourly and daily weather forecasts</p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="text-center p-6">
                  <div className="text-4xl mb-4">🔐</div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800">Personal History</h3>
                  <p className="text-gray-600">Save your search history and get personalized recommendations</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Start Guide */}
            <div className="mt-12 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">🚀 Quick Start</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl mb-2">1️⃣</div>
                    <p>Search for any city worldwide</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-2xl mb-2">2️⃣</div>
                    <p>Explore different weather features</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-2xl mb-2">3️⃣</div>
                    <p>Login to save your preferences</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12">
          <p className="text-white/70 text-sm">
            Built with ❤️ using Next.js, Tailwind CSS, MongoDB & AI
          </p>
          <p className="text-white/50 text-xs mt-2">
            Real-time data from OpenWeatherMap • Secure user authentication
          </p>
        </footer>
      </div>
    </div>
  );
}