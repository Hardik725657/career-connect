// controllers/jobController.js
// Handles all job-related operations:
// - Get all jobs (with search and filters)
// - Get a single job by ID
// - Create a new job (recruiter only)
// - Update a job (recruiter only)
// - Delete a job (recruiter only)

const Job = require('../models/Job');

// ─── GET ALL JOBS (with search & filter) ─────────────────────────────────────
// GET /api/jobs
// GET /api/jobs?search=developer&location=Bangalore&jobType=Remote
const getAllJobs = async (req, res) => {
  try {
    // Build a query object dynamically based on URL query parameters
    // Example URL: /api/jobs?search=react&location=bangalore
    const query = {};

    // Only show open jobs to the public
    query.status = 'open';

    // SEARCH by keyword - searches in title, description, or skills
    if (req.query.search) {
      const keyword = req.query.search;
      // $or means: match title OR description OR requiredSkills
      // $regex makes it a case-insensitive partial match
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(keyword, 'i')] } },
        { company: { $regex: keyword, $options: 'i' } }
      ];
    }

    // FILTER by location
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }

    // FILTER by job type (Full Time, Remote, etc.)
    if (req.query.jobType) {
      query.jobType = req.query.jobType;
    }

    // FILTER by category
    if (req.query.category) {
      query.category = { $regex: req.query.category, $options: 'i' };
    }

    // FILTER by skills
    if (req.query.skills) {
      query.requiredSkills = { $in: [new RegExp(req.query.skills, 'i')] };
    }

    // Fetch jobs from MongoDB
    // .populate('recruiter', 'name email') fills in the recruiter's name and email
    //   instead of just showing the recruiter's ID
    // .sort({ createdAt: -1 }) shows newest jobs first (-1 = descending order)
    const jobs = await Job.find(query)
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Get All Jobs Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while fetching jobs' });
  }
};

// ─── GET SINGLE JOB ──────────────────────────────────────────────────────────
// GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    // req.params.id is the :id from the URL (e.g., /api/jobs/64abc123...)
    const job = await Job.findById(req.params.id)
      .populate('recruiter', 'name email');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, job });
  } catch (error) {
    console.error('Get Job Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while fetching job' });
  }
};

// ─── CREATE JOB ──────────────────────────────────────────────────────────────
// POST /api/jobs
// Only recruiters can post jobs (enforced by roleMiddleware)
const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, jobType, experience, category, requiredSkills, requirements } = req.body;

    // Validate required fields
    if (!title || !description || !location) {
      return res.status(400).json({ success: false, message: 'Title, description and location are required' });
    }

    // Create the job document
    // recruiter is set to the logged-in user's ID (from JWT via authMiddleware)
    const job = await Job.create({
      title,
      description,
      company: company || req.user.name, // Use provided company or user's name
      recruiter: req.user._id, // Set the recruiter to the current logged-in user
      location,
      salary,
      jobType,
      experience,
      category,
      requiredSkills: requiredSkills || [],
      requirements: requirements || []
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job
    });
  } catch (error) {
    console.error('Create Job Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while creating job' });
  }
};

// ─── UPDATE JOB ──────────────────────────────────────────────────────────────
// PUT /api/jobs/:id
// Only the recruiter who posted the job can update it
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if the logged-in user is the recruiter who posted this job
    // job.recruiter is an ObjectId, req.user._id is also ObjectId
    // We use .toString() to compare them as strings
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only update your own job postings' });
    }

    // Update the job with new data
    // { new: true } returns the updated document instead of the old one
    // { runValidators: true } ensures schema validations still run
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Update Job Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while updating job' });
  }
};

// ─── DELETE JOB ──────────────────────────────────────────────────────────────
// DELETE /api/jobs/:id
// Only the recruiter who posted the job (or admin) can delete it
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Only the job's recruiter or admin can delete it
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only delete your own job postings' });
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete Job Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while deleting job' });
  }
};

// ─── GET RECRUITER'S OWN JOBS ─────────────────────────────────────────────────
// GET /api/jobs/my-jobs
// Returns all jobs posted by the currently logged-in recruiter
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Get My Jobs Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs };
