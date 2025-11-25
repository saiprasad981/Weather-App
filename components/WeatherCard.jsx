import { Card, CardHeader, CardContent } from './ui/card';

export const WeatherCard = ({ weatherData }) => {
  if (!weatherData) return null;

  const {
    name,
    main: { temp, feels_like, humidity, pressure },
    weather: [{ main, description, icon }],
    wind: { speed },
    visibility
  } = weatherData;

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const WeatherItem = ({ icon, label, value, unit }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-semibold">{value} {unit}</p>
      </div>
    </div>
  );

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📍</span>
            <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <img 
                src={getWeatherIcon(icon)} 
                alt={description}
                className="w-12 h-12"
              />
              <span className="text-3xl font-bold text-gray-800">
                {Math.round(temp)}°C
              </span>
            </div>
            <p className="text-gray-600 capitalize">{description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WeatherItem 
            icon="🌡️"
            label="Feels like"
            value={Math.round(feels_like)}
            unit="°C"
          />
          <WeatherItem 
            icon="💧"
            label="Humidity"
            value={humidity}
            unit="%"
          />
          <WeatherItem 
            icon="💨"
            label="Wind Speed"
            value={speed}
            unit="m/s"
          />
          <WeatherItem 
            icon="📊"
            label="Pressure"
            value={pressure}
            unit="hPa"
          />
          <WeatherItem 
            icon="👁️"
            label="Visibility"
            value={(visibility / 1000).toFixed(1)}
            unit="km"
          />
          <WeatherItem 
            icon="☁️"
            label="Conditions"
            value={main}
            unit=""
          />
        </div>
      </CardContent>
    </Card>
  );
};