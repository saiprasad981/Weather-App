import { Card, CardHeader, CardContent } from './ui/card';

export const WeatherTimeline = ({ weatherData }) => {
  const generateTimeline = () => {
    const hours = [];
    const currentHour = new Date().getHours();
    
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % 24;
      const temp = Math.round(weatherData.main.temp + (Math.random() * 4 - 2));
      const conditions = ['☀️', '⛅', '☁️', '🌧️', '⛈️'];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      hours.push({
        time: `${hour}:00`,
        temperature: temp,
        condition: condition,
        precipitation: Math.random() > 0.7 ? `${Math.round(Math.random() * 60)}%` : '0%'
      });
    }
    
    return hours;
  };

  const timeline = generateTimeline();

  return (
    <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-0 shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="text-3xl">📊</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">24-Hour Forecast</h2>
            <p className="text-gray-600">Hourly weather predictions</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-teal-100">
          <div className="flex overflow-x-auto pb-4 space-x-4">
            {timeline.map((hour, index) => (
              <div key={index} className="flex-shrink-0 w-20 text-center">
                <div className="bg-white rounded-xl p-3 shadow-sm border">
                  <div className="text-lg mb-1">{hour.condition}</div>
                  <div className="font-semibold text-gray-800">{hour.temperature}°</div>
                  <div className="text-xs text-gray-500 mt-1">{hour.time}</div>
                  {hour.precipitation !== '0%' && (
                    <div className="text-xs text-blue-600 mt-1">{hour.precipitation}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-teal-50 rounded-xl">
              <div className="text-2xl mb-2">📈</div>
              <p className="font-semibold text-gray-800">Peak Temperature</p>
              <p className="text-2xl font-bold text-teal-600">{Math.max(...timeline.map(h => h.temperature))}°C</p>
            </div>
            <div className="text-center p-4 bg-cyan-50 rounded-xl">
              <div className="text-2xl mb-2">📉</div>
              <p className="font-semibold text-gray-800">Lowest Temperature</p>
              <p className="text-2xl font-bold text-cyan-600">{Math.min(...timeline.map(h => h.temperature))}°C</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl mb-2">🌧️</div>
              <p className="font-semibold text-gray-800">Rain Probability</p>
              <p className="text-2xl font-bold text-blue-600">
                {timeline.filter(h => h.precipitation !== '0%').length > 0 ? 'Likely' : 'Unlikely'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};