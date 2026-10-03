// controllers/savedJobController.js
// Handles bookmarking/saving jobs:
// - Save a job (candidate)
// - Get all saved jobs (candidate)
// - Remove a saved job (candidate)

const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// ─── SAVE A JOB ──────────────────────────────────────────────────────────────
// POST /api/saved-jobs/:jobId
// Adds a job to the candidate's saved/bookmarked list
const saveJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Check the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if already saved
    const alreadySaved = await SavedJob.findOne({
      candidate: req.user._id,
      job: jobId
    });

    if (alreadySaved) {
      return res.status(400).json({ success: false, message: 'Job is already saved' });
    }

    // Create a new saved job record
    await SavedJob.create({
      candidate: req.user._id,
      job: jobId
    });

    res.status(201).json({
      success: true,
      message: 'Job saved successfully!'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Job already saved' });
    }
    console.error('Save Job Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET MY SAVED JOBS ────────────────────────────────────────────────────────
// GET /api/saved-jobs
// Returns all jobs saved by the currently logged-in candidate
const getSavedJobs = async (req, res) => {
  try {
    // Find all saved jobs for this user
    // .populate('job') fills in the full job details instead of just the ID
    const savedJobs = await SavedJob.find({ candidate: req.user._id })
      .populate('job', 'title company location salary jobType category experience status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: savedJobs.length,
      savedJobs
    });
  } catch (error) {
    console.error('Get Saved Jobs Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── REMOVE SAVED JOB ─────────────────────────────────────────────────────────
// DELETE /api/saved-jobs/:jobId
// Removes a job from the candidate's saved list
const removeSavedJob = async (req, res) => {
  try {
    const result = await SavedJob.findOneAndDelete({
      candidate: req.user._id,
      job: req.params.jobId
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Saved job not found' });
    }

    res.json({
      success: true,
      message: 'Job removed from saved list'
    });
  } catch (error) {
    console.error('Remove Saved Job Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { saveJob, getSavedJobs, removeSavedJob };
