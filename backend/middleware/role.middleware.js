// middleware/role.middleware.js

// Role-based access control middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not authenticated.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}. Current role: ${req.user.role}`
      });
    }

    next();
  };
};

// Specific role middleware functions
const isAdmin = authorizeRoles('ADMIN');
const isFaculty = authorizeRoles('FACULTY', 'ADMIN');
const isStudent = authorizeRoles('STUDENT', 'FACULTY', 'ADMIN');

// Resource ownership middleware (users can only edit their own content)
const isOwnerOrAdmin = (resourceField = 'postedBy') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not authenticated.'
      });
    }

    // Admin can access everything
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.params.userId || req.body[resourceField] || req.query[resourceField];
    
    if (resourceUserId && resourceUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    }

    next();
  };
};

// Target audience middleware for notices
const canViewNotice = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. User not authenticated.'
    });
  }

  // Admin can view all notices
  if (req.user.role === 'ADMIN') {
    return next();
  }

  // For notice viewing, we'll check the targetAudience in the controller
  // This middleware just ensures the user is authenticated
  next();
};

export {
  authorizeRoles,
  isAdmin,
  isFaculty,
  isStudent,
  isOwnerOrAdmin,
  canViewNotice
};
