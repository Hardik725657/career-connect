// server.js
// This is the MAIN entry point of our backend application.
// Think of this file as the "starting point" - like the main() function.
// It sets up Express, connects to MongoDB, and starts listening for requests.

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
// This makes process.env.PORT, process.env.MONGO_URI etc. available
dotenv.config();

// Connect to MongoDB database
connectDB();

// Create an Express application
const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
// Middleware runs on EVERY request before it reaches the route handler.

// CORS: Allows the frontend (running on port 5173) to talk to backend (port 5000)
// Without CORS, the browser will block the request for security reasons
app.use(cors({
  origin: 'http://localhost:5173', // Your React Vite frontend URL
  credentials: true
}));

// express.json(): Automatically parses incoming JSON data in request body
// Without this, req.body would be undefined
app.use(express.json());

// Serve uploaded files (resumes) as static files
// Example: http://localhost:5000/uploads/resume.pdf
app.use('/uploads', express.static('uploads'));

// ─── ROUTES ──────────────────────────────────────────────────────────────────
// Import all route files and attach them to specific URL paths

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const savedJobRoutes = require('./routes/savedJobRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Every request starting with /api/auth will go to authRoutes
app.use('/api/auth', authRoutes);

// Every request starting with /api/jobs will go to jobRoutes
app.use('/api/jobs', jobRoutes);

// Every request starting with /api/applications will go to applicationRoutes
app.use('/api/applications', applicationRoutes);

// Every request starting with /api/saved-jobs will go to savedJobRoutes
app.use('/api/saved-jobs', savedJobRoutes);

// Every request starting with /api/upload-resume will go to uploadRoutes
app.use('/api/upload-resume', uploadRoutes);

// Every request starting with /api/admin will go to adminRoutes
app.use('/api/admin', adminRoutes);

// ─── DEFAULT ROUTE ────────────────────────────────────────────────────────────
// A simple test route to verify the backend is running
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CareerConnect Job Portal Backend is running!'
  });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
