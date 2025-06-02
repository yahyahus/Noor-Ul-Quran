const mongoose = require('mongoose');
let mongoStr = 'mongodb+srv://yahyahus187:project187@noorulquran.ovgin.mongodb.net/?retryWrites=true&w=majority&appName=NoorulQuran';

const connectDB = async () => {
  try {

    await mongoose.connect( mongoStr || process.env.MONGODB_URI, {
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); 
  }
};

module.exports = connectDB;