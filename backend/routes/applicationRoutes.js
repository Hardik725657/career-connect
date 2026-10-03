// routes/applicationRoutes.js
// Defines all application-related URL endpoints

const express = require('express');
const router = express.Router();

const {
  applyForJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus
} = require('../controllers/applicationController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// POST /api/applications
// Only candidates can apply for jobs
router.post('/', protect, authorize('candidate'), applyForJob);

// GET /api/applications/my
// Candidate sees their own applications
router.get('/my', protect, authorize('candidate'), getMyApplications);

// GET /api/applications/job/:jobId
// Recruiter sees all applicants for one of their jobs
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getApplicantsForJob);

// PUT /api/applications/:id/status
// Recruiter updates the status of an application (e.g., "Shortlisted")
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
