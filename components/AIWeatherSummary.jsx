import { Card, CardHeader, CardContent } from './ui/card';

export const AIWeatherSummary = ({ summary, weatherData }) => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="text-3xl">🤖</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">AI Weather Assistant</h2>
            <p className="text-gray-600">Smart insights for your day</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Your Daily Forecast</h3>
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>
          </div>
          
          {/* Quick Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <span className="text-xl">✅</span>
              <span className="text-sm text-green-800">Best time for outdoor activities</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <span className="text-xl">⚠️</span>
              <span className="text-sm text-blue-800">Carry umbrella after 3 PM</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};