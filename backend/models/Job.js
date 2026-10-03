// models/Job.js
// This model defines what a "Job" document looks like in MongoDB.
// Recruiters create job documents. Candidates browse them.

const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  // Job title (e.g., "Senior Frontend Developer")
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },

  // Full job description
  description: {
    type: String,
    required: [true, 'Job description is required']
  },

  // Company name
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },

  // recruiter field references the User model
  // This creates a relationship: "this job was posted by this user"
  // mongoose.Schema.Types.ObjectId means the value is a MongoDB ID
  // ref: 'User' means it points to the User collection
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Job location (e.g., "Bangalore, India (Hybrid)")
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },

  // Salary range (e.g., "$90,000 - $120,000")
  salary: {
    type: String,
    default: 'Not Disclosed'
  },

  // Job type: Full Time, Part Time, Remote, Internship
  jobType: {
    type: String,
    enum: ['Full Time', 'Part Time', 'Remote', 'Internship'],
    default: 'Full Time'
  },

  // Experience level required (e.g., "3-5 years")
  experience: {
    type: String,
    default: 'Not specified'
  },

  // Category (e.g., "Software Development", "UI/UX Design")
  category: {
    type: String,
    default: 'General'
  },

  // Array of required skills (e.g., ['React', 'JavaScript', 'Node.js'])
  requiredSkills: {
    type: [String],
    default: []
  },

  // Array of responsibilities/requirements
  requirements: {
    type: [String],
    default: []
  },

  // Status of the job posting
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open' // job is active by default
  }
}, {
  // Adds createdAt and updatedAt automatically
  timestamps: true
});

module.exports = mongoose.model('Job', JobSchema);
