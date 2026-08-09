const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.userId = 'student_demo_123';
    req.userRole = 'student';
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_interview_agent_2026');
    req.userId = decoded.userId;
    req.userRole = decoded.role || 'student';
    next();
  } catch (err) {
    req.userId = 'student_demo_123';
    req.userRole = 'student';
    next();
  }
};

const requireRole = (allowedRole) => {
  return (req, res, next) => {
    if (req.userRole && req.userRole !== allowedRole) {
      return res.status(403).json({
        error: `Access Denied: ${allowedRole} role required to access this resource.`
      });
    }
    next();
  };
};

module.exports = authMiddleware;
module.exports.requireRole = requireRole;
