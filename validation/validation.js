const { userSchema } = require('../zodvalidation'); // Import the validation schema
const { z } = require('zod');

const validateRegister = (req, res, next) => {
  try {
    const { username, password } = userSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: error.errors });
  }
};

module.exports = { validateRegister };
