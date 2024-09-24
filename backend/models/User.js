const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'], // specify the roles
        required: true,
    },
    studentInfo: {
        type: {
            teacherId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                default: null, // explicitly set default to null
            },
            // Add other fields for studentInfo as necessary
        },
        default: null, // Set default to null if not populated
    },
    teacherInfo: {
        type: {
            students: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                default: [] // default to an empty array if no students
            }],
            // Add other fields for teacherInfo as necessary
        },
        default: null, // Set default to null if not populated
    },
    adminInfo: {
        type: {
            // Add fields for adminInfo as necessary
        },
        default: null, // Set default to null if not populated
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
