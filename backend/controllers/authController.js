const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secret = process.env.JWT_SECRET || 'mysecret';

const generateToken = (user) => {

  return jwt.sign({ id: user._id }, secret, {
    expiresIn: 60, 
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  console.log('Request Body:', req.body);
  const user = await User.findOne({ username, password });
  if (user) {
    const token = generateToken(user);
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, 
        sameSite: 'none',
     });
    return res.status(200).json({ message: 'Login successful', token, role: user.role });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};
  

const register = async (req, res) => {
  const { username, password, firstname, lastname, role } = req.body;
  console.log('Request Body:', req.body);

  const existingUser = await User.findOne({ username });
  if (!existingUser) {
    try {
      const user = await User.create({ username, password, firstname, lastname, role });
      console.log(role);

      const token = generateToken(user);
      res.cookie('token', token, { httpOnly: true, secure: true });
      return res.status(200).json({ message: 'User Created', user });
    }catch (err) {
      console.error('Error during user creation:', err); // Log the full error
      res.status(400).json({ message: 'User Creation failed', error: err.message });
    }

  } else {
    res.status(400).json({ message: 'Username already exists' });
  }
};


  
  const logout = (req, res) => {
    if(req.cookies.token) {
     
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' });
    return res.status(200).json({ message: 'Logout successful' },);
    } else if (!req.cookies.token) {
      return res.status(204).json({ message: 'Already logged out' });
    }
    else {
      return res.status(400).json({ message: 'Logout failed' });
    }
    
  };
  
const portal = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(406).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user;
    return res.status(200).json({ message: 'Welcome to the portal' });
  });
};

  module.exports = { login, register,portal, logout };
  