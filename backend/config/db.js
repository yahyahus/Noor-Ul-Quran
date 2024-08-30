const mongoose = require('mongoose');
let mongoStr = 'mongodb+srv://ibrahimumair900:demotest123@cluster0.dvaqrpv.mongodb.net/newcred';

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
