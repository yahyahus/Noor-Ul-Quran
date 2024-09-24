const checkRole = (requiredRole) => {
    return (req, res, next) => {
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
      }
      next(); // User has the correct role, proceed to the next middleware/route
    };
  };
  
  module.exports = checkRole;
  