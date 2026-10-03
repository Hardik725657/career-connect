// middleware/roleMiddleware.js
// This middleware checks if the logged-in user has the REQUIRED ROLE
// to access a specific route.
//
// Usage example:
//   router.post('/jobs', protect, authorize('recruiter'), createJob)
//   This means: only logged-in recruiters can create jobs.

const authorize = (...roles) => {
  // This returns a middleware function
  // The spread operator (...roles) allows passing multiple roles:
  // authorize('recruiter') or authorize('admin', 'recruiter')
  return (req, res, next) => {
    // req.user is set by authMiddleware (protect)
    // Check if the user's role is in the allowed roles list
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Only ${roles.join(' or ')} can perform this action.`
      });
    }

    // User has the right role, continue to the route handler
    next();
  };
};

module.exports = { authorize };
