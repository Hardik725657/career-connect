// controllers/applicationController.js
// Handles all job application operations:
// - Apply for a job (candidate)
// - Get all my applications (candidate)
// - Get all applicants for a job (recruiter)
// - Update application status (recruiter)

const Application = require('../models/Application');
const Job = require('../models/Job');

// ─── APPLY FOR A JOB ─────────────────────────────────────────────────────────
// POST /api/applications
// Only candidates can apply
const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required' });
    }

    // Check if the job exists and is open
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });
    }

    // Check if the candidate has already applied to this job
    // We use both job and candidate IDs to check for duplicates
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    // Create a new Application document
    const application = await Application.create({
      job: jobId,
      candidate: req.user._id, // The logged-in user's ID (from JWT)
      resumeUrl: req.user.resumeUrl, // Use the resume they uploaded earlier
      coverLetter: coverLetter || '',
      status: 'Pending'
    });

    // Populate job and candidate info in the response
    const populatedApp = await Application.findById(application._id)
      .populate('job', 'title company location salary jobType')
      .populate('candidate', 'name email');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application: populatedApp
    });
  } catch (error) {
    // Handle duplicate application error (from the unique index in the model)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }
    console.error('Apply Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while submitting application' });
  }
};

// ─── GET MY APPLICATIONS (Candidate) ─────────────────────────────────────────
// GET /api/applications/my
// Returns all applications submitted by the currently logged-in candidate
const getMyApplications = async (req, res) => {
  try {
    // Find all applications where candidate = current user's ID
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title company location salary jobType status') // Fill in job details
      .sort({ appliedDate: -1 }); // Newest first

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get My Applications Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET APPLICANTS FOR A JOB (Recruiter) ────────────────────────────────────
// GET /api/applications/job/:jobId
// Returns all candidates who applied for a specific job
const getApplicantsForJob = async (req, res) => {
  try {
    // First verify the job exists and belongs to this recruiter
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Only the job's recruiter or admin can see applicants
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Get all applications for this job
    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email phone location resumeUrl skills headline') // Fill in candidate details
      .sort({ appliedDate: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get Applicants Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── UPDATE APPLICATION STATUS (Recruiter) ───────────────────────────────────
// PUT /api/applications/:id/status
// Allows recruiter to update status: Pending → Under Review → Shortlisted → Accepted/Rejected
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status value
    const allowedStatuses = ['Pending', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Only the recruiter of the job or admin can update status
    if (application.job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Update the status
    application.status = status;
    await application.save();

    res.json({
      success: true,
      message: `Application status updated to "${status}"`,
      application
    });
  } catch (error) {
    console.error('Update Status Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { applyForJob, getMyApplications, getApplicantsForJob, updateApplicationStatus };
