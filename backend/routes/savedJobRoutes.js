// routes/savedJobRoutes.js
// Defines all saved/bookmarked job endpoints
// Only candidates can save jobs

const express = require('express');
const router = express.Router();

const { saveJob, getSavedJobs, removeSavedJob } = require('../controllers/savedJobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All saved job routes require login and candidate role

// POST /api/saved-jobs/:jobId
// Save (bookmark) a job
router.post('/:jobId', protect, authorize('candidate'), saveJob);

// GET /api/saved-jobs
// Get all saved jobs for the logged-in candidate
router.get('/', protect, authorize('candidate'), getSavedJobs);

// DELETE /api/saved-jobs/:jobId
// Remove a job from saved list
router.delete('/:jobId', protect, authorize('candidate'), removeSavedJob);

module.exports = router;
