const { userSchema } = require('./zodValidation');

const validateRegister = (req, res, next) => {
  try {
    userSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: error.errors });
  }
};

module.exports = validateRegister;
