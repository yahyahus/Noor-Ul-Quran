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

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());


app.use('/', authRoutes);
app.use('/', generalroutes);
app.use('/teacher', teacherRoutes);
app.use('/admin', adminRoutes); 
app.use('/student', studentRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the backend API!');
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
