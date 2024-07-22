const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
};


const authRoutes = require('./routes/auth');

const app = express();
const PORT = 5000;
app.use(cors(corsOptions));

// Middleware
app.use(express.json()); 

// Routes
app.use('/', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the backend API!');
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://ibrahimumair900:demotest123@cluster0.dvaqrpv.mongodb.net/newcred')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 
