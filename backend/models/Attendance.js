const mongoose = require('mongoose');
const User = require('./User');

const attendanceSchema = new mongoose.Schema
({
   
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
        type: Date,
        required: true,
    },

    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'excused'],
        required: true,
    },

    timestamp: {
        type: Date,
        default: Date.now,
    },


})

module.exports = mongoose.model('Attendance', attendanceSchema);


