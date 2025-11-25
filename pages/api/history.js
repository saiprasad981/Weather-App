import connectDB from '../../lib/database';
import User from '../../models/User';

export default async function handler(req, res) {
  // Connect to database first
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ error: 'Database connection failed' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const { userId } = req.query;
        
        console.log('GET History - User ID:', userId);
        
        if (!userId || userId === 'undefined') {
          return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Return user's search history sorted by timestamp
        const sortedHistory = user.searchHistory
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 20);

        console.log('Found history entries:', sortedHistory.length);
        
        res.status(200).json({ 
          history: sortedHistory
        });
      } catch (error) {
        console.error('GET History error:', error);
        res.status(500).json({ error: 'Failed to fetch history: ' + error.message });
      }
      break;

    case 'POST':
      try {
        const { userId, city, temperature, condition } = req.body;
        
        console.log('POST History - User ID:', userId, 'City:', city);
        
        if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Add to search history (avoid duplicates within 1 hour)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentEntry = user.searchHistory.find(entry => 
          entry.city.toLowerCase() === city.toLowerCase() &&
          new Date(entry.timestamp) > oneHourAgo
        );

        if (!recentEntry) {
          user.searchHistory.unshift({
            city,
            temperature,
            condition,
            timestamp: new Date()
          });

          // Keep only last 50 entries
          if (user.searchHistory.length > 50) {
            user.searchHistory = user.searchHistory.slice(0, 50);
          }

          await user.save();
          console.log('History saved for user:', userId);
        } else {
          console.log('Duplicate entry skipped for user:', userId);
        }

        res.status(200).json({ message: 'History saved successfully' });
      } catch (error) {
        console.error('POST History error:', error);
        res.status(500).json({ error: 'Failed to save history: ' + error.message });
      }
      break;

    case 'DELETE':
      try {
        const { userId } = req.body;
        
        console.log('DELETE History - User ID:', userId);
        
        if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        user.searchHistory = [];
        await user.save();

        console.log('History cleared for user:', userId);
        
        res.status(200).json({ message: 'History cleared successfully' });
      } catch (error) {
        console.error('DELETE History error:', error);
        res.status(500).json({ error: 'Failed to clear history: ' + error.message });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}