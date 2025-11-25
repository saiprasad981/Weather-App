import connectDB from '../../lib/database';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  try {
    // Connect to database in production
    if (process.env.NODE_ENV === 'production') {
      await connectDB();
    }

    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
    );

    const data = await response.json();

    if (!response.ok) {
      if (data.cod === '404') {
        return res.status(404).json({ error: 'City not found. Please check the spelling.' });
      }
      if (data.cod === '401') {
        return res.status(500).json({ error: 'Invalid API key. Please check your OpenWeatherMap API key.' });
      }
      return res.status(response.status).json({ error: data.message || 'Failed to fetch weather data' });
    }

    // Transform the data
    const transformedData = {
      name: data.name,
      coord: data.coord,
      main: {
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
      },
      weather: data.weather,
      wind: {
        speed: data.wind.speed,
      },
      visibility: data.visibility,
    };

    res.status(200).json(transformedData);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Internal server error while fetching weather data' });
  }
}