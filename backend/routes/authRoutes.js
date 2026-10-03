// routes/authRoutes.js
// Routes define the URL endpoints and map them to controller functions.
// Think of routes as the "address book" - they tell Express:
// "When someone sends a request to THIS URL, run THAT controller function."

const express = require('express');
const router = express.Router();

// Import controller functions
const { register, login, getMe, updateProfile } = require('../controllers/authController');

// Import middleware
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register
// Public route - anyone can register
// No authentication required
router.post('/register', register);

// POST /api/auth/login
// Public route - anyone can login
router.post('/login', login);

// GET /api/auth/me
// Protected route - must be logged in
// protect middleware runs first, then getMe controller
router.get('/me', protect, getMe);

// PUT /api/auth/me
// Protected route - update your own profile
router.put('/me', protect, updateProfile);

module.exports = router;
