import connectDB from '../../../lib/database';
import User from '../../../models/User';

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

  const { email, password, name } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create new user (password will be hashed by the pre-save hook)
    const user = new User({
      email: email.toLowerCase(),
      password: password, // This will be hashed automatically
      name,
      searchHistory: []
    });

    await user.save();

    console.log('New user created:', user.email);
    
    res.status(201).json({ 
      success: true,
      message: 'User created successfully',
      user: { 
        id: user._id.toString(), 
        email: user.email, 
        name: user.name 
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}