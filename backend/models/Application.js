// models/Application.js
// This model tracks which candidate applied for which job.
// It creates a relationship between a Candidate (User) and a Job.

const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  // Which job was applied to - references the Job collection
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },

  // Which candidate applied - references the User collection
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // URL to the candidate's resume at the time of application
  resumeUrl: {
    type: String,
    default: ''
  },

  // Application status - recruiter can update this
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected'],
    default: 'Pending'
  },

  // When the candidate applied
  appliedDate: {
    type: Date,
    default: Date.now // automatically set to current date/time
  },

  // Cover letter or additional note from candidate (optional)
  coverLetter: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure a candidate can only apply to the same job ONCE
// This creates a compound unique index on (job, candidate) pair
ApplicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
