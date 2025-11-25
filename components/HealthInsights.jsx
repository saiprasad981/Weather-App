import { Card, CardHeader, CardContent } from './ui/card';

export const HealthInsights = ({ healthData, weatherData }) => {
  const getUVLevel = (uv) => {
    if (uv <= 2) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (uv <= 5) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (uv <= 7) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { level: 'Very High', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const uvInfo = getUVLevel(healthData?.uvIndex || 3);

  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="text-3xl">❤️</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Health & Safety Insights</h2>
            <p className="text-gray-600">Stay healthy in current conditions</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* UV Protection */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">☀️</span>
              <h3 className="font-semibold text-gray-800">UV Protection</h3>
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full ${uvInfo.bg} ${uvInfo.color} font-medium mb-3`}>
              {uvInfo.level} UV Index
            </div>
            <p className="text-gray-700 text-sm mb-3">
              {uvInfo.level === 'Low' && 'Minimal sun protection required. Enjoy the outdoors!'}
              {uvInfo.level === 'Moderate' && 'Stay in shade during midday. Wear sunscreen.'}
              {uvInfo.level === 'High' && 'Use SPF 30+ sunscreen. Wear protective clothing.'}
              {uvInfo.level === 'Very High' && 'Avoid sun exposure. Use maximum protection.'}
            </p>
          </div>

          {/* Air Quality */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💨</span>
              <h3 className="font-semibold text-gray-800">Air Quality</h3>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium mb-3">
              Good for Outdoor Activities
            </div>
            <p className="text-gray-700 text-sm">
              Perfect conditions for exercise and outdoor activities. Air quality is excellent.
            </p>
          </div>

          {/* Allergy Alert */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-yellow-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🌼</span>
              <h3 className="font-semibold text-gray-800">Allergy Alert</h3>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium mb-3">
              Low Pollen Count
            </div>
            <p className="text-gray-700 text-sm">
              Favorable conditions for allergy sufferers. Pollen levels are minimal.
            </p>
          </div>

          {/* Hydration */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💧</span>
              <h3 className="font-semibold text-gray-800">Hydration Guide</h3>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-medium mb-3">
              Stay Hydrated
            </div>
            <p className="text-gray-700 text-sm">
              Drink 2-3 liters of water today. Moderate temperatures with comfortable humidity levels.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};