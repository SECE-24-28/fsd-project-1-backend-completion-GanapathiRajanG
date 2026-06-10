const express = require('express');
const router = express.Router();
const { submitAdmission, getAdmissions } = require('../Controller/AdmissionController');
const { authenticateUser, authorizeRoles } = require('../Middleware/authMiddleware');
const upload = require('../Utils/upload');

// Public route for students to apply
router.post('/submit', upload.array('documents', 5), submitAdmission);

// Admin route to view all applications
router.get('/', authenticateUser, authorizeRoles('admin'), getAdmissions);

module.exports = router;
