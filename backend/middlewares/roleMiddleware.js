const checkRole = (requiredRole) => {
    return (req, res, next) => {
      if (req.user.role !== requiredRole) {
        
        //logging the error for debugging
        console.error('Access forbidden: insufficient permissions');
        return res.status(403).json({ message: 'Access forbidden: insufficient permissions' });
      }
      next(); // User has the correct role, proceed to the next middleware/route
    };
  };
  
  module.exports = checkRole;
  