const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // 1. Check if all required fields are provided
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // 3. Hash password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Determine status (NGOs require Admin approval, Donors are active by default)
    const userRole = role || 'donor';
    const status = userRole === 'ngo' ? 'pending' : 'active';

    // 5. Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: userRole,
      status,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token: generateToken(user._id),
        message:
          user.role === 'ngo'
            ? 'Registration successful! Pending Admin approval.'
            : 'Registration successful!',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate request body
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Find user by email
    const user = await User.findOne({ email });

    // 3. Match password
    if (user && (await bcrypt.compare(password, user.password))) {
      // Check account status restrictions
      if (user.status === 'blocked') {
        return res.status(403).json({ message: 'Your account has been blocked by admin.' });
      }

      if (user.role === 'ngo' && user.status === 'pending') {
        return res.status(403).json({ message: 'Your NGO account is pending admin approval.' });
      }

      if (user.status === 'rejected') {
        return res.status(403).json({ message: 'Your NGO account request has been rejected.' });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};