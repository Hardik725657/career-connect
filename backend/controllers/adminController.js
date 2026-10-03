// controllers/adminController.js
// Admin controller handles platform management.
// ONLY users with role 'admin' can use these routes.
// Admins can view all users, jobs, and applications.

const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// ─── GET ALL USERS ────────────────────────────────────────────────────────────
// GET /api/admin/users
// Returns a list of all registered users (without passwords)
const getAllUsers = async (req, res) => {
  try {
    // .select('-password') returns all fields EXCEPT password
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Admin Get Users Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET ALL JOBS (Admin) ─────────────────────────────────────────────────────
// GET /api/admin/jobs
// Returns ALL jobs including open and closed ones
const getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Admin Get Jobs Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET ALL APPLICATIONS (Admin) ────────────────────────────────────────────
// GET /api/admin/applications
// Returns ALL applications across the entire platform
const getAllApplicationsAdmin = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('job', 'title company location')
      .populate('candidate', 'name email')
      .sort({ appliedDate: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Admin Get Applications Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET PLATFORM STATISTICS ──────────────────────────────────────────────────
// GET /api/admin/stats
// Returns summary statistics for the admin dashboard
const getStats = async (req, res) => {
  try {
    // Count all documents in each collection
    const totalUsers = await User.countDocuments();
    const totalCandidates = await User.countDocuments({ role: 'candidate' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalJobs = await Job.countDocuments();
    const openJobs = await Job.countDocuments({ status: 'open' });
    const totalApplications = await Application.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalJobs,
        openJobs,
        totalApplications
      }
    });
  } catch (error) {
    console.error('Admin Stats Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllUsers, getAllJobsAdmin, getAllApplicationsAdmin, getStats };
