const jwt = require('jsonwebtoken');

const authenticateStudent = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'bullsworth-secret');
    if (payload.role !== 'student') {
      return res.status(403).json({ message: 'Access denied. Student role required.' });
    }
    req.student = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authorization token.' });
  }
};

const authenticateTeacher = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'bullsworth-secret');
    if (payload.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied. Teacher role required.' });
    }
    req.teacher = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authorization token.' });
  }
};

module.exports = { authenticateStudent, authenticateTeacher };
