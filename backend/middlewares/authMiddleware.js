const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'mysecret';

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Extract token from cookies

  if (!token) {
    console.log('No token found');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.log('Error verifying token:', err);
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user; 
    next(); 
  });
};

module.exports = authenticateToken;
