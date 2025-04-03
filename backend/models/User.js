const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

userSchema.pre('save', async function (next) {
    try {
        // Only hash the password if it has been modified (new or updated)
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }

        // Role-specific initialization
        if (this.role === 'student') {
            if (!this.studentInfo) {
                this.studentInfo = {}; // Initialize studentInfo if not present
            }
            this.teacherInfo = null;
            this.adminInfo = null;
        } else if (this.role === 'teacher') {
            if (!this.teacherInfo) {
                this.teacherInfo = { students: [] };
            }
            this.studentInfo = null;
            this.adminInfo = null;
        } else if (this.role === 'admin') {
            if (!this.adminInfo) {
                this.adminInfo = {}; // Initialize adminInfo if not present
            }
            this.studentInfo = null;
            this.teacherInfo = null;
        }

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);
