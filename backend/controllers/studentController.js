const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { getWorkingDays } = require('./generalController');

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

module.exports = {getAttendance};