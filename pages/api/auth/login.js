import connectDB from '../../../lib/database';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({ error: 'Database connection failed' });
  }

  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    console.log('User logged in:', user.email);
    
    res.status(200).json({ 
      success: true,
      message: 'Login successful',
      user: { 
        id: user._id.toString(), 
        email: user.email, 
        name: user.name,
        searchHistory: user.searchHistory || []
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}