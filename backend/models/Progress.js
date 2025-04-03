// models/progress.js
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String, // Keep this consistent with the attendance date format
    required: true,
  },
  sabaq: {
    completed : Boolean, 
    numberOfLines: Number,
    startingSurah : {
      number : Number,
      name : String,
    },
    endingSurah : {
      number : Number,
      name : String,
    },
    startingAyah : Number,
    endingAyah : Number,
    remarks: String,
  },
  sabqi: {
    completed : Boolean, 
    juzz: {
      number : Number,
      name : String,
    },
    quality: Number,
    remarks: String, 
  },  
  manzil: {
    completed : Boolean, 
    juzz : {
      number : Number,
      name : String,
    },
    quality: Number,
    remarks: String,
  },
});

module.exports = mongoose.model('Progress', progressSchema);