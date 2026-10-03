// models/SavedJob.js
// This model tracks which jobs a candidate has bookmarked/saved.
// Similar to a "wishlist" - candidates save jobs to apply later.

const mongoose = require('mongoose');

const SavedJobSchema = new mongoose.Schema({
  // Which candidate saved this job
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Which job was saved
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  }
}, {
  timestamps: true // createdAt tells us when the job was saved
});

// A candidate can save the same job only ONCE
// compound unique index prevents duplicate saves
SavedJobSchema.index({ candidate: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('SavedJob', SavedJobSchema);
