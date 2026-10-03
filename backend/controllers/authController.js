// controllers/authController.js
// Controllers contain the actual BUSINESS LOGIC for each route.
// Think of controllers as the "brain" that decides what to do with a request.
//
// Auth Controller handles:
// 1. Register a new user
// 2. Login an existing user
// 3. Get the currently logged-in user's profile

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ─── HELPER FUNCTION ─────────────────────────────────────────────────────────
// generateToken creates a signed JWT token for a given user ID
// This token is sent to the frontend and used for all future authenticated requests
const generateToken = (id) => {
  return jwt.sign(
    { id },               // Payload: what data to store inside the token
    process.env.JWT_SECRET, // Secret key: used to sign and verify the token
    { expiresIn: '7d' }  // Token expires in 7 days
  );
};

// ─── REGISTER ────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Creates a new user account in the database
const register = async (req, res) => {
  try {
    // Destructure the data sent from the frontend registration form
    const { name, email, password, role } = req.body;

    // Validate: check all required fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Create a new User document
    // Password will be automatically hashed by the pre-save hook in User.js
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'candidate' // default role is candidate
    });

    // Generate JWT token for the newly registered user
    const token = generateToken(user._id);

    // Send success response with token and user data
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Authenticates a user and returns a JWT token
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user by email in MongoDB
    const user = await User.findOne({ email });

    // If user not found, return error
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Compare entered password with the hashed password stored in DB
    // user.matchPassword() is the method we defined in User.js model
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Password matches! Generate a token
    const token = generateToken(user._id);

    // Send token and user info to frontend
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        resumeUrl: user.resumeUrl
      }
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// ─── GET CURRENT USER ─────────────────────────────────────────────────────────
// GET /api/auth/me
// Returns the profile of the currently logged-in user
// This route is PROTECTED (requires valid JWT token)
const getMe = async (req, res) => {
  try {
    // req.user is set by the authMiddleware (protect)
    // The user is already fetched without the password field
    const user = req.user;

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        resumeUrl: user.resumeUrl,
        phone: user.phone,
        location: user.location,
        headline: user.headline,
        bio: user.bio,
        skills: user.skills
      }
    });
  } catch (error) {
    console.error('Get Me Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── UPDATE PROFILE ──────────────────────────────────────────────────────────
// PUT /api/auth/me
// Allows the logged-in user to update their profile information
const updateProfile = async (req, res) => {
  try {
    const { name, phone, location, headline, bio, skills } = req.body;

    // Find the user by their ID (from the JWT token via authMiddleware)
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update only the fields that were provided
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (headline) user.headline = headline;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;

    // Save the updated user (password hash won't change since password wasn't modified)
    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        headline: user.headline,
        bio: user.bio,
        skills: user.skills,
        resumeUrl: user.resumeUrl
      }
    });
  } catch (error) {
    console.error('Update Profile Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { register, login, getMe, updateProfile };
