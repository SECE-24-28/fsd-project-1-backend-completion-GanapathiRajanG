const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing.' });
  }

  // Support offline bypass mock tokens
  if (token.startsWith('mock-')) {
    const parts = token.split('-');
    const role = parts[1]; // student, teacher, or admin
    const id = parts.slice(2).join('-');
    
    if (role === 'admin') {
      req.user = { userId: 'admin-bypass-id-9999', role: 'admin' };
    } else if (role === 'student') {
      req.user = { userId: id, role: 'student' };
    } else if (role === 'teacher') {
      req.user = { userId: id, role: 'teacher' };
    } else if (role === 'local') {
      const actualId = parts.slice(3).join('-');
      req.user = { userId: actualId, role: 'student' };
    } else {
      req.user = { userId: id, role: role };
    }
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'bullsworth-secret');
    req.user = payload;

    // Check if user is banned (skip for admin bypass token)
    if (payload.userId !== 'admin-bypass-id-9999') {
      const User = require('../Models/UserModel');
      const user = await User.findById(payload.userId).select('status');
      if (user && user.status === 'Banned') {
        return res.status(403).json({ message: 'Your account has been banned.' });
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authorization token.' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions.' });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };
