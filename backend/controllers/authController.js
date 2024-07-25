const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secret = process.env.JWT_SECRET || 'mysecret';

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, secret, {
    expiresIn: '1h',
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true, secure: true });
    return res.status(200).json({ message: 'Login successful', token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};

const register = async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (!existingUser) {
    try {
      const user = await User.create({ username, password });
      res.status(201).json({ message: 'User Created', user });
    } catch (err) {
      res.status(400).json({ message: 'User Creation failed', error: err.message });
    }
  } else {
    res.status(400).json({ message: 'Username already exists' });
  }
};

const portal = (req, res) => {
  res.status(200).json({ message: 'Welcome to the portal' });
};

module.exports = { login, register, portal };
