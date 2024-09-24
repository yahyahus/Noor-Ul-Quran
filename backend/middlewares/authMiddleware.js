const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'mysecret';

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Extract token from cookies

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user;  // Add user information to request object
    next(); // Proceed to next middleware or route handler
  });
};

module.exports = authenticateToken;
