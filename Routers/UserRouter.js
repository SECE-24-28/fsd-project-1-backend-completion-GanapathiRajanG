const express = require('express');
const router = express.Router();
const { signupUser, loginUser, profileUser, forgotPassword } = require('../Controller/UserController');
const { authenticateUser } = require('../Middleware/authMiddleware');

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/profile', authenticateUser, profileUser);

module.exports = router;