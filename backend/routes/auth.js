const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegister } = require('../validation/validation');
const checkAuth = require('../middleware/session');


const secret = 'mysecret';
const generateToken = (user) => {
  return jwt.sign({ id: user.id }, secret, {
    expiresIn: 3600,
  });
};

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne ({ username, password }); 
  if (user) { 
    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true, secure: true });
    return res.status(200).json({ message: 'Login successful', token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});



// Register Route
router.post('/register', validateRegister,async (req, res) => {
  
  let username = req.body.username;
  let password = req.body.password;

  const existingUser = await User.findOne({ username });
  if(!existingUser)
    {
      User.create({
        username: username,
        password: password
    })
    .then((user) => {
        res.status(201).json({
            message : "User Created ",
        });
    })
    .catch((err) => {
        res.status(400).json({
            message : "User Creation failed ",
        });
    });
    }
 

  else
  {
    return res.status(400).json({message : "Username already exists."})
  
  }
});


// Portal Route
router.get('/portal', checkAuth, (req, res) => {
  res.status(200).json({ message: 'Welcome to the portal' });
});


module.exports = router;
