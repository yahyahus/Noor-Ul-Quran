const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { getWorkingDays } = require('./generalController');
const Progress = require('../models/Progress');

const getAttendance = async (req, res) => {
    const {month, year} = req.query;
    const studentId = req.user.id;

    const WorkingDays = await getWorkingDays(month, year);
    const attendanceList = [];
    try {
        for(const date of WorkingDays)
            {
            const attendance = await Attendance.findOne({studentId, date});
            if(attendance)
                {
                attendanceList.push({date, status: attendance.status});
                }
        }
        res.status(200).json({attendanceList});
    }
    catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({message: 'Server error'});
    }
};

const viewProgress = async (req, res) => {
    const { date } = req.query; // Date passed as a query parameter
    const studentId = req.user.id; // Extract studentId from the logged-in user

    if (!date) {
        return res.status(400).json({ message: "Date is required." });
    }

    try {
        const progress = await Progress.findOne({ studentId, date })
            .populate('studentId', 'name')
            .populate('teacherId', 'name');
        if (!progress) {
            return res.status(404).json({ message: "Progress not found." });
        }

        res.status(200).json({
            message: "Progress retrieved successfully.",
            studentName: progress.studentId.name,
            teacherName: progress.teacherId.name,
            sabaq: progress.sabaq,
            sabqi: progress.sabqi,
            manzil: progress.manzil,
        });
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ message: "Server error." });
    }
};



module.exports = {getAttendance, viewProgress};