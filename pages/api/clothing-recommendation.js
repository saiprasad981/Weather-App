export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { weather } = req.body;
    
    const temp = weather.main.temp;
    const condition = weather.weather[0].main;
    
    let recommendation = '';
    
    if (temp < 10) {
      recommendation = "Bundle up! Wear thermal layers, a heavy jacket, warm pants, and insulated footwear. Don't forget gloves and a scarf.";
    } else if (temp < 20) {
      recommendation = "Perfect for light layers. A jacket over long sleeves with comfortable pants and closed shoes will keep you comfortable.";
    } else {
      recommendation = "Light and comfortable clothing is ideal. T-shirts, shorts or light pants, and breathable footwear are recommended.";
    }

    if (condition === 'Rain') {
      recommendation += " Bring a waterproof jacket and umbrella. Avoid light fabrics that get heavy when wet.";
    } else if (condition === 'Clear') {
      recommendation += " Don't forget sunglasses and consider a hat for sun protection.";
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    res.status(200).json({ recommendation });
  } catch (error) {
    console.error('Clothing recommendation error:', error);
    res.status(500).json({ error: 'Failed to generate clothing recommendation' });
  }
}