const User = require('../Models/UserModel');
const Student = require('../Models/StudentModel');
const Teacher = require('../Models/TeacherModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signupUser = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password, confirmpassword } = req.body;

    if (!firstname || !lastname || !email || !password || !confirmpassword) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: 'Password and confirmation do not match.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with that email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const isTeacher = email.toLowerCase().includes('faculty') || email.toLowerCase().includes('teacher');
    const role = isTeacher ? 'teacher' : 'student';

    const user = new User({
      firstname,
      lastname,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role,
    });

    const savedUser = await user.save();

    if (role === 'student') {
      const student = new Student({
        userId: savedUser._id,
        name: `${savedUser.firstname} ${savedUser.lastname}`,
        email: savedUser.email,
      });
      await student.save();
    } else if (role === 'teacher') {
      const teacher = new Teacher({
        userId: savedUser._id,
        name: `${savedUser.firstname} ${savedUser.lastname}`,
        email: savedUser.email,
      });
      await teacher.save();
    }

    const responseUser = {
      id: savedUser._id,
      firstname: savedUser.firstname,
      lastname: savedUser.lastname,
      email: savedUser.email,
      phone: savedUser.phone,
      role: savedUser.role,
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: responseUser,
    });
  } catch (error) {
    res.status(500).json({
      message: 'User registration failed',
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password.' });
    }

    const searchEmail = email.trim().toLowerCase();
    let formatSearch = searchEmail;
    if (!searchEmail.includes('@')) {
      formatSearch = `${searchEmail}@bullsworth.edu`;
    }

    const user = await User.findOne({
      $or: [
        { email: searchEmail },
        { email: formatSearch }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.status === 'Banned') {
      return res.status(403).json({ message: 'Your account has been banned.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'bullsworth-secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Login failed',
      error: error.message,
    });
  }
};

const profileUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      message: 'Profile retrieved successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch profile',
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide your email address.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email address.' });
    }

    // In a real product, replace this with email delivery logic.
    res.status(200).json({
      message: 'Password reset requested. Check your email for instructions.',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Password reset request failed',
      error: error.message,
    });
  }
};

module.exports = { signupUser, loginUser, profileUser, forgotPassword };