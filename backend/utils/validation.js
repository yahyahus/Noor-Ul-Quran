const { userSchema, usernameSchema, passwordSchema } = require('./zodValidation');

const validateRegister = (req, res, next) => {
  
  if (!(usernameSchema.safeParse(req.body).success))
    {
      return res.status(400).json({ message: 'Username should be at least 6 characters.' });
    }
  else if (!(passwordSchema.safeParse(req.body).success))
    {
      return res.status(400).json({ message: 'Password should be at least 3 characters.' });
    }
  next();
  
  
};

module.exports = validateRegister;
