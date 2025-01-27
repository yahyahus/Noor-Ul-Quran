const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Constants
const STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Response formatter
const formatResponse = (status, message, data = null) => {
  const response = {
    status,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (data) {
    response.data = data;
  }
  
  return response;
};

const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    username: user.username // Adding username can be useful for frontend
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'mysecret',
    { expiresIn: '7d' } // More readable than seconds
  );
};

const setCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    sameSite: 'none'
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED)
        .json(formatResponse(STATUS.ERROR, 'Invalid username or password'));
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED)
        .json(formatResponse(STATUS.ERROR, 'Invalid username or password'));
    }
    
    const token = generateToken(user);
    setCookie(res, token);
    
    const userData = {
      id: user._id,
      username: user.username,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname
    };
    
    return res.status(HTTP_STATUS.OK)
      .json(formatResponse(STATUS.SUCCESS, 'Login successful', { user: userData, token }));
      
  } catch (error) {
    console.error('Login error:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(formatResponse(STATUS.ERROR, 'An error occurred during login'));
  }
};

const register = async (req, res) => {
  const { username, password, firstname, lastname, role } = req.body;
  
  try {
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      return res.status(HTTP_STATUS.CONFLICT)
        .json(formatResponse(STATUS.ERROR, 'Username is already taken'));
    }
    
    const user = await User.create({
      username,
      password,
      firstname,
      lastname,
      role: role || 'user' // Default role if not specified
    });
    
    const token = generateToken(user);
    setCookie(res, token);
    
    const userData = {
      id: user._id,
      username: user.username,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname
    };
    
    return res.status(HTTP_STATUS.CREATED)
      .json(formatResponse(STATUS.SUCCESS, 'Registration successful', { user: userData, token }));
      
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(formatResponse(STATUS.ERROR, 'An error occurred during registration'));
  }
};

const logout = (req, res) => {
  if (!req.cookies.token) {
    return res.status(HTTP_STATUS.OK)
      .json(formatResponse(STATUS.SUCCESS, 'Already logged out'));
  }
  
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    
    return res.status(HTTP_STATUS.OK)
      .json(formatResponse(STATUS.SUCCESS, 'Logout successful'));
      
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json(formatResponse(STATUS.ERROR, 'An error occurred during logout'));
  }
};

const isLoggedIn = (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED)
      .json(formatResponse(STATUS.ERROR, 'Authentication required'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecret');
    
    return res.status(HTTP_STATUS.OK)
      .json(formatResponse(STATUS.SUCCESS, 'User is authenticated', {
        user: {
          id: decoded.id,
          role: decoded.role,
          username: decoded.username
        }
      }));
      
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(HTTP_STATUS.FORBIDDEN)
      .json(formatResponse(STATUS.ERROR, 'Invalid or expired token'));
  }
};

module.exports = {
  login,
  register,
  logout,
  isLoggedIn
};