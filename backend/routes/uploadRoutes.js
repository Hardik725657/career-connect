// routes/uploadRoutes.js
// Handles file upload (resume PDF)
// Uses Multer - a middleware for handling multipart/form-data (file uploads)

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// ─── MULTER CONFIGURATION ─────────────────────────────────────────────────────
// diskStorage tells Multer WHERE and with WHAT NAME to save the uploaded file

const storage = multer.diskStorage({
  // destination: the folder where files will be saved
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save to the 'uploads' folder (will be created)
  },

  // filename: how to name the saved file
  filename: function (req, file, cb) {
    // Create a unique filename: userId + timestamp + original extension
    // Example: 64abc123_1709123456789.pdf
    const uniqueName = req.user._id + '_' + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// fileFilter: reject non-PDF/DOC files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only PDF and DOC files are allowed'), false); // Reject
  }
};

// Create the multer upload instance
// limits.fileSize limits the upload to 5MB (5 * 1024 * 1024 bytes)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
});

// ─── UPLOAD RESUME ROUTE ─────────────────────────────────────────────────────
// POST /api/upload-resume
// Protected: only logged-in users can upload
// upload.single('resume') tells Multer to expect ONE file with field name "resume"
router.post('/', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Build the URL to access the uploaded file
    // Example: http://localhost:5000/uploads/64abc123_1709123456789.pdf
    const resumeUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Update the user's resumeUrl in MongoDB
    await User.findByIdAndUpdate(req.user._id, { resumeUrl });

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeUrl,
      fileName: req.file.originalname
    });
  } catch (error) {
    console.error('Upload Error:', error.message);
    res.status(500).json({ success: false, message: 'Error uploading file' });
  }
});

module.exports = router;
