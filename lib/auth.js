import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-fallback-secret-for-development';

// Generate JWT token
export function generateToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Middleware to protect API routes
export function withAuth(handler) {
  return async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Add user info to request
      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  };
}

// Simple session management for development
export const sessionManager = {
  // In a real app, you'd use a database or Redis for sessions
  sessions: new Map(),

  createSession(userId, userData) {
    const sessionId = generateToken({ userId });
    this.sessions.set(sessionId, { userId, userData, createdAt: Date.now() });
    return sessionId;
  },

  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session && Date.now() - session.createdAt < 24 * 60 * 60 * 1000) { // 24 hours
      return session;
    }
    this.sessions.delete(sessionId);
    return null;
  },

  destroySession(sessionId) {
    this.sessions.delete(sessionId);
  },

  // Clean up expired sessions (call this periodically in production)
  cleanup() {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.createdAt > 24 * 60 * 60 * 1000) {
        this.sessions.delete(sessionId);
      }
    }
  }
};