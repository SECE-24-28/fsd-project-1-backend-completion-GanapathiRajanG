const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, approveAdmission, banUser, deleteUser } = require('../Controller/AdminController');
const { authenticateUser, authorizeRoles } = require('../Middleware/authMiddleware');

router.use(authenticateUser);
router.use(authorizeRoles('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.post('/admissions/:id/approve', approveAdmission);
router.patch('/users/:id/ban', banUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
