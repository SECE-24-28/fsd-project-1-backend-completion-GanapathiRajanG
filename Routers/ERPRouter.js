const express = require('express');
const router = express.Router();
const { getStudentProfile, getTeacherProfile } = require('../Controller/ERPController');
const { authenticateUser, authorizeRoles } = require('../Middleware/authMiddleware');

router.use(authenticateUser);

router.get('/student-profile', authorizeRoles('student'), getStudentProfile);
router.get('/teacher-profile', authorizeRoles('teacher', 'admin'), getTeacherProfile);

module.exports = router;
