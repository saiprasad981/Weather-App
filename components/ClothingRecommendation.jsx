import { Card, CardHeader, CardContent } from './ui/card';

export const ClothingRecommendation = ({ recommendation, weatherData }) => {
  const getOutfitSuggestions = (temp, condition) => {
    const baseOutfits = [];
    
    if (temp < 10) {
      baseOutfits.push('Heavy winter jacket', 'Thermal layers', 'Warm boots', 'Scarf and gloves');
    } else if (temp < 20) {
      baseOutfits.push('Light jacket', 'Long sleeves', 'Comfortable pants', 'Closed shoes');
    } else {
      baseOutfits.push('T-shirt', 'Shorts or light pants', 'Comfortable shoes', 'Sunglasses');
    }

    if (condition.toLowerCase().includes('rain')) {
      baseOutfits.push('Waterproof jacket', 'Umbrella', 'Water-resistant shoes');
    }

    if (condition.toLowerCase().includes('sun')) {
      baseOutfits.push('Sun hat', 'Sunglasses', 'Light colors');
    }

    return baseOutfits;
  };

  const outfits = getOutfitSuggestions(weatherData.main.temp, weatherData.weather[0].description);

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-0 shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="text-3xl">👕</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Smart Outfit Planner</h2>
            <p className="text-gray-600">Dress perfectly for the weather</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">AI Recommendation</h3>
              <p className="text-gray-700 leading-relaxed">{recommendation}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>✅</span> Recommended Items
            </h3>
            <ul className="space-y-2">
              {outfits.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>⚠️</span> Items to Avoid
            </h3>
            <ul className="space-y-2">
              {weatherData.main.temp > 25 && (
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Heavy fabrics and dark colors
                </li>
              )}
              {weatherData.weather[0].main === 'Rain' && (
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Open-toed shoes and light fabrics
                </li>
              )}
              {weatherData.main.temp < 15 && (
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Thin layers without insulation
                </li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};