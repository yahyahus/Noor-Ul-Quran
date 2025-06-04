require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./router/authRoutes');
const teacherRoutes = require('./router/teacherRouter');
const adminRoutes = require('./router/adminRouter');
const generalroutes = require('./router/generalRouter');
const studentRoutes = require('./router/studentRouter');

const app = express();
const PORT = process.env.PORT || 5000;

// Define allowed frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://noor-ul-quran-dusky.vercel.app'
];

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/', authRoutes);
app.use('/', generalroutes);
app.use('/teacher', teacherRoutes);
app.use('/admin', adminRoutes); 
app.use('/student', studentRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the backend API!');
});

// Connect to DB and start server
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
