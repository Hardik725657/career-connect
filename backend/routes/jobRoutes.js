// routes/jobRoutes.js
// Defines all job-related URL endpoints

const express = require('express');
const router = express.Router();

const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs
} = require('../controllers/jobController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────
// These routes do NOT require login - anyone can view jobs

// GET /api/jobs
// GET /api/jobs?search=react&location=bangalore&jobType=Remote
router.get('/', getAllJobs);

// GET /api/jobs/my-jobs
// Protected: Only logged-in recruiters can see their own jobs
// IMPORTANT: This must come BEFORE the /:id route to avoid "my-jobs" being treated as an ID
router.get('/my-jobs', protect, authorize('recruiter', 'admin'), getMyJobs);

// GET /api/jobs/:id
// Get details of a single job
router.get('/:id', getJobById);

// ─── PROTECTED ROUTES ─────────────────────────────────────────────────────────
// These routes require login AND specific role

// POST /api/jobs
// Only recruiters can create jobs
// middleware chain: protect → authorize → createJob
router.post('/', protect, authorize('recruiter', 'admin'), createJob);

// PUT /api/jobs/:id
// Only the recruiter who posted the job can update it
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);

// DELETE /api/jobs/:id
// Only the recruiter who posted the job or admin can delete it
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
