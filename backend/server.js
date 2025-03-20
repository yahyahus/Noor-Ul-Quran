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

connectDB();

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "https://noor-ul-quran1.vercel.app"
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(cookieParser());
app.use(express.json());

app.options("*", cors());


app.use('/', authRoutes);
app.use('/', generalroutes);
app.use('/teacher', teacherRoutes);
app.use('/admin', adminRoutes); 
app.use('/student', studentRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the backend API!');
});

console.log("Allowed frontend:", process.env.FRONTEND_URL);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
