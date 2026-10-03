// routes/adminRoutes.js
// Admin-only routes for platform management
// ALL admin routes require: login + admin role

const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getAllJobsAdmin,
  getAllApplicationsAdmin,
  getStats
} = require('../controllers/adminController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Every route here requires: valid JWT + role must be 'admin'
// We can apply middleware to the entire router using router.use()
router.use(protect);
router.use(authorize('admin'));

// GET /api/admin/users - View all registered users
router.get('/users', getAllUsers);

// GET /api/admin/jobs - View all job postings
router.get('/jobs', getAllJobsAdmin);

// GET /api/admin/applications - View all applications
router.get('/applications', getAllApplicationsAdmin);

// GET /api/admin/stats - Get platform statistics
router.get('/stats', getStats);

module.exports = router;
