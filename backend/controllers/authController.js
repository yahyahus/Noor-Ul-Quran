const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const secret = process.env.JWT_SECRET || 'mysecret';

const generateToken = (user) => {

  return jwt.sign({ id: user._id, role: user.role}, secret, {
    expiresIn: 150, 
  });
};


const login = async (req, res) => {
  const { username, password } = req.body;
  console.log('Request Body:', req.body);

  try {
    // Find user by username only
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token if login is successful
    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'none',
    });

    return res.status(200).json({ message: 'Login successful', token, role: user.role });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
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
      return res.status(200).json({ message: 'User Created', user, token, role: user.role });
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

  const isloggedin = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(406).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user;
    return res.status(200).json({ message: 'Welcome to the portal', role: user.role });
  });
}




  module.exports = { login, register,isloggedin, logout };
  