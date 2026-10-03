// middleware/authMiddleware.js
// Middleware runs BETWEEN the incoming request and the route handler.
// This middleware checks if the user has a valid JWT token.
// If YES → the request continues to the controller.
// If NO  → send back "Unauthorized" error.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // JWT tokens are sent in the "Authorization" header as:
  // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract just the token part (remove "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // jwt.verify() decodes the token using our secret key
      // If the token is valid, decoded contains { id, role, iat, exp }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database using the ID from the token
      // .select('-password') means: get all fields EXCEPT password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      // Call next() to pass control to the next middleware or route handler
      next();
    } catch (error) {
      // This happens if token is expired or tampered with
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
