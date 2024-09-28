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
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null, // explicitly set default to null
        },
    },
    teacherInfo: {
        students: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: [], // default to an empty array if no students
        }],
        // Add other fields for teacherInfo as necessary
    },
    adminInfo: {
        // Add fields for adminInfo as necessary
    },
}, {
    timestamps: true,
});
//what does the below code do?
//A: The below code is a pre-save middleware that runs before saving a document to the database. It checks the role of the user and initializes the corresponding info object (studentInfo, teacherInfo, or adminInfo) if it is not already present. This ensures that the info objects are always present and avoids potential errors when accessing or updating them later.

userSchema.pre('save', function (next) {
    // Ensure only the respective role info is initialized
    if (this.role === 'student') {
        if (!this.studentInfo) {
            this.studentInfo = {}; // Initialize studentInfo if not present
        }
        this.teacherInfo = null; // Set other role fields to null
        this.adminInfo = null;
    }

    if (this.role === 'teacher') {
        if (!this.teacherInfo) {
            this.teacherInfo = { students: [] }; // Initialize teacherInfo with an empty students array
        }
        this.studentInfo = null;
        this.adminInfo = null;
    }

    if (this.role === 'admin') {
        if (!this.adminInfo) {
            this.adminInfo = {}; // Initialize adminInfo if not present
        }
        this.studentInfo = null;
        this.teacherInfo = null;
    }

    next();
});
module.exports = mongoose.model('User', userSchema);
