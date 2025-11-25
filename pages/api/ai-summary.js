export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { city, weather, userId } = req.body;
    
    // Enhanced smart summary that never repeats "carry umbrella at 3 PM"
    const smartSummary = generateSmartSummary(city, weather);
    console.log('✅ Using Enhanced Smart Summary');
    return res.status(200).json({ summary: smartSummary });
    
  } catch (error) {
    console.error('AI Summary error:', error);
    const { city, weather } = req.body;
    const smartSummary = generateSmartSummary(city, weather);
    res.status(200).json({ summary: smartSummary });
  }
}

// Completely redesigned smart fallback - NO MORE REPETITIVE PHRASES
function generateSmartSummary(city, weather) {
  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const condition = weather.weather[0].main.toLowerCase();
  const humidity = weather.main.humidity;
  const windSpeed = weather.wind.speed;
  const pressure = weather.main.pressure;
  
  // Time-based greetings
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";
  
  // Dynamic activity suggestions based on actual conditions
  const getActivitySuggestions = () => {
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return [
        "Perfect for visiting museums or art galleries",
        "Great day for library visits or cozy cafe hopping",
        "Ideal for indoor workouts or yoga sessions",
        "Wonderful for movie marathons or reading books"
      ];
    } else if (condition.includes('clear') || condition.includes('sun')) {
      return [
        "Excellent for park picnics and outdoor games",
        "Perfect for photography and nature walks",
        "Great for cycling or jogging in open spaces",
        "Ideal for beach visits or riverfront walks"
      ];
    } else {
      return [
        "Comfortable for shopping and market exploration",
        "Great for zoo visits or botanical gardens",
        "Perfect for city tours and sightseeing",
        "Ideal for outdoor dining and social gatherings"
      ];
    }
  };

  // Smart clothing recommendations
  const getClothingAdvice = () => {
    if (temp > 30) return "Light cotton clothes and sunscreen recommended";
    if (temp > 25) return "Comfortable summer wear with a hat";
    if (temp > 20) return "Light layers with a casual jacket";
    if (temp > 15) return "Warm layers with a light sweater";
    if (temp > 10) return "Jacket with multiple layers needed";
    return "Heavy winter clothing with thermal layers";
  };

  // Weather-specific insights
  const getWeatherInsights = () => {
    const insights = [];
    
    if (humidity > 80) insights.push("High humidity may make it feel warmer than actual temperature");
    if (windSpeed > 6) insights.push("Breezy conditions - perfect for kite flying");
    if (pressure < 1000) insights.push("Low pressure system may bring weather changes");
    if (pressure > 1020) insights.push("Stable high pressure ensures consistent weather");
    if (feelsLike > temp + 3) insights.push("Humidity makes it feel warmer than the thermometer shows");
    if (feelsLike < temp - 3) insights.push("Wind chill makes it feel cooler than actual temperature");
    
    return insights.length > 0 ? insights[Math.floor(Math.random() * insights.length)] : 
           "Comfortable conditions with no major weather concerns";
  };

  const activities = getActivitySuggestions();
  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
  const clothingAdvice = getClothingAdvice();
  const weatherInsight = getWeatherInsights();

  // Condition-specific summaries with variety
  const summaryTemplates = {
    clear: `${greeting}! Beautiful sunny day in ${city} with ${temp}°C. ${randomActivity}. ${clothingAdvice}. ${weatherInsight}.`,
    clouds: `${greeting}! Pleasant cloudy conditions in ${city} at ${temp}°C. ${randomActivity}. ${clothingAdvice}. ${weatherInsight}.`,
    rain: `${greeting}! Rainy atmosphere in ${city} with ${temp}°C temperatures. ${randomActivity}. ${clothingAdvice}. ${weatherInsight}.`,
    snow: `${greeting}! Winter magic in ${city} with ${temp}°C and snowfall. ${randomActivity}. ${clothingAdvice}. ${weatherInsight}.`,
    thunderstorm: `${greeting}! Stormy weather in ${city} at ${temp}°C. ${randomActivity}. ${clothingAdvice}. ${weatherInsight}.`,
    drizzle: `${greeting}! Gentle rain in ${city} creating a peaceful ${temp}°C ambiance. ${randomActivity}. ${clothingAdvice}. ${weatherInsight}.`
  };

  const conditionKey = Object.keys(summaryTemplates).find(key => 
    condition.includes(key)
  ) || 'clouds';

  return summaryTemplates[conditionKey];
}