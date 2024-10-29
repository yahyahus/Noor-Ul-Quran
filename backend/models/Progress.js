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
    type: Boolean,
    default: false, // Marks completion status, initially false
  },
  sabqi: {
    type: Boolean,
    default: false,
  },
  manzil: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Progress', progressSchema);