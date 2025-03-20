const mongoose = require('mongoose');
require('dotenv').config(); 

const mongoStr = process.env.MONGODB_URI || 'mongodb+srv://yahyahus187:project187@noorulquran.ovgin.mongodb.net/?retryWrites=true&w=majority&appName=NoorulQuran';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoStr); // ✅ No need for extra options

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
