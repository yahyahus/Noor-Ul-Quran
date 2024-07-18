const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { validateRegister } = require('../validation/validation'); // Import the validation middleware

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

router.post('/login', async (req,res)=>{
  let username = req.body.username;
  let password = req.body.password;

  let isUser = await User.findOne({username, password})
  if(isUser)
    return res.status(200).json({message : 'Login successful'})
  else
    {
      return res.status(401).json({message : 'Invalid credentials'})
    }

})

module.exports = router;
