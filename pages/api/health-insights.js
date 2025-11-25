export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { weather } = req.body;
    
    const temp = Math.round(weather.main.temp);
    const condition = weather.weather[0].main;
    const humidity = weather.main.humidity;
    const windSpeed = weather.wind.speed;
    
    // Smart UV calculation based on actual conditions
    let uvIndex;
    if (condition === 'Clear') {
      uvIndex = temp > 25 ? 8 : temp > 20 ? 6 : 4;
    } else if (condition === 'Clouds') {
      uvIndex = temp > 25 ? 5 : temp > 20 ? 3 : 2;
    } else {
      uvIndex = 2; // Low UV for rainy/overcast conditions
    }
    
    // Smart air quality based on conditions
    let airQuality = 'Good';
    if (humidity > 85 && windSpeed < 2) airQuality = 'Moderate';
    if (condition === 'Dust' || condition === 'Haze') airQuality = 'Poor';
    
    // Smart pollen levels
    let pollenLevel = 'Low';
    if (condition === 'Clear' && temp > 20 && humidity < 70) pollenLevel = 'High';
    if (condition === 'Clear' && temp > 15) pollenLevel = 'Moderate';
    
    // Smart workout recommendations
    let workoutRecommendation = '';
    if (temp > 30) workoutRecommendation = 'Early morning (6-8 AM) or late evening (7-9 PM)';
    else if (temp > 25) workoutRecommendation = 'Morning (7-10 AM) or evening (6-8 PM)';
    else if (temp < 5) workoutRecommendation = 'Midday (11 AM-2 PM) when warmest';
    else workoutRecommendation = 'Anytime - perfect workout conditions';
    
    // Smart hydration index
    let hydrationIndex = 'Moderate';
    if (temp > 28 || humidity < 30) hydrationIndex = 'High';
    if (temp < 15 && humidity > 70) hydrationIndex = 'Low';

    const healthData = {
      uvIndex: Math.min(uvIndex, 11),
      airQuality,
      pollenLevel,
      hydrationIndex,
      workoutRecommendation,
      specificTips: generateSpecificTips(temp, condition, humidity, windSpeed)
    };

    await new Promise(resolve => setTimeout(resolve, 600));

    res.status(200).json(healthData);
  } catch (error) {
    console.error('Health insights error:', error);
    res.status(500).json({ error: 'Failed to generate health insights' });
  }
}

function generateSpecificTips(temp, condition, humidity, windSpeed) {
  const tips = [];
  
  if (temp > 30) tips.push('Drink water every 30 minutes during outdoor activities');
  if (temp < 10) tips.push('Protect exposed skin from cold winds');
  if (humidity > 80) tips.push('High humidity may affect breathing during intense exercise');
  if (windSpeed > 6) tips.push('Windy conditions - protect eyes and secure loose items');
  if (condition === 'Clear' && temp > 20) tips.push('Apply sunscreen 30 minutes before going outside');
  if (condition === 'Rain') tips.push('Wear waterproof footwear to avoid discomfort');
  
  return tips.length > 0 ? tips : ['No specific health concerns - enjoy your day!'];
}