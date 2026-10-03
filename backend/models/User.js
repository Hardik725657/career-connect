// models/User.js
// A Mongoose Model is like a blueprint for how data is stored in MongoDB.
// This model defines what a "User" document looks like in the database.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema (structure) for a User document
const UserSchema = new mongoose.Schema({
  // User's full name
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true // removes extra spaces
  },

  // Email must be unique - no two users can have the same email
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true, // always store email in lowercase
    trim: true
  },

  // Password will be stored as a hashed string (never plain text!)
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },

  // Role defines what the user can do in the system
  // candidate - can apply for jobs
  // recruiter - can post jobs
  // admin - can manage everything
  role: {
    type: String,
    enum: ['candidate', 'recruiter', 'admin'], // only these 3 values allowed
    default: 'candidate' // if not specified, user is a candidate
  },

  // URL to the uploaded resume (set after resume upload)
  resumeUrl: {
    type: String,
    default: ''
  },

  // Profile details (used for the Profile page)
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  headline: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  skills: {
    type: [String], // array of strings like ['React', 'Node.js']
    default: []
  }
}, {
  // timestamps: true automatically adds createdAt and updatedAt fields
  timestamps: true
});

// ─── MIDDLEWARE (Pre-save Hook) ───────────────────────────────────────────────
// This runs BEFORE saving the user document to MongoDB.
// It automatically hashes the password before saving.
// We NEVER store plain text passwords!
UserSchema.pre('save', async function (next) {
  // Only hash the password if it was modified (prevents re-hashing on profile updates)
  if (!this.isModified('password')) {
    return next();
  }

  // bcrypt.genSalt(10) - creates a random "salt" with 10 rounds
  // A salt makes each hash unique even for the same password
  const salt = await bcrypt.genSalt(10);

  // bcrypt.hash() combines password + salt and creates a secure hash
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── INSTANCE METHOD ─────────────────────────────────────────────────────────
// A method we can call on any user object to compare passwords during login
// user.matchPassword('entered_password') returns true or false
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // bcrypt.compare() compares the plain text password with the stored hash
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model so other files can use it
module.exports = mongoose.model('User', UserSchema);
