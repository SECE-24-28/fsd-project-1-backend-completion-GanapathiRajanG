const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing.' });
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
