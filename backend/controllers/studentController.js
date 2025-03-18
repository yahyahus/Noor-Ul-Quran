const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { getWorkingDays } = require('./generalController');
const Progress = require('../models/Progress');
const { startOfWeek, endOfWeek, format } = require('date-fns');

const getAttendance = async (req, res) => {
    const { month, year } = req.query;
    const studentId = req.user.id;

    const WorkingDays = await getWorkingDays(month, year); // Get all working days

    try {
        // Fetch all attendance records for the student in one query
        const attendanceRecords = await Attendance.find({
            studentId,
            date: { $in: WorkingDays }
        }).lean(); // Using .lean() for faster read performance

        // Convert attendance records into a map for easy lookup
        const attendanceMap = new Map(attendanceRecords.map(record => [record.date, record.status]));

        // Generate the final attendance list
        const attendanceList = WorkingDays.map(date => {
            return { 
                date, 
                status: attendanceMap.has(date) ? attendanceMap.get(date) : "Not Marked"
            };
        });

        res.status(200).json({ attendanceList });
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ message: "Server error" });
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

const getTodayProgress = async (req, res) => {
    const studentId = req.user.id;
    const today = format(new Date(), 'yyyy-MM-dd');

    try {
        const progress = await Progress.findOne({ studentId, date: today })
            .populate('teacherId', 'name');

        if (!progress) {
            return res.status(404).json({ 
                message: "No progress recorded for today." 
            });
        }

        res.status(200).json({
            success: true,
            data: {
                sabaq: {
                    lines: progress.sabaq.numberOfLines,
                    completed: progress.sabaq.completed,
                    startingSurah: progress.sabaq.startingSurah,
                    endingSurah: progress.sabaq.endingSurah,
                    remarks: progress.sabaq.remarks
                },
                sabqi: {
                    juzz: progress.sabqi.juzz,
                    completed: progress.sabqi.completed,
                    quality: progress.sabqi.quality,
                    remarks: progress.sabqi.remarks
                },
                manzil: {
                    juzz: progress.manzil.juzz,
                    completed: progress.manzil.completed,
                    quality: progress.manzil.quality,
                    remarks: progress.manzil.remarks
                }
            }
        });
    } catch (error) {
        console.error('Error fetching today\'s progress:', error);
        res.status(500).json({ message: "Server error." });
    }
};

// Get weekly progress stats
const getWeeklyProgress = async (req, res) => {
    const studentId = req.user.id;
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);

    try {
        const weeklyProgress = await Progress.find({
            studentId,
            date: {
                $gte: format(weekStart, 'yyyy-MM-dd'),
                $lte: format(weekEnd, 'yyyy-MM-dd')
            }
        }).sort({ date: 1 });

        // Format data for frontend charts
        const formattedData = weeklyProgress.map(progress => ({
            day: format(new Date(progress.date), 'EEE'),
            sabaq: {
                lines: progress.sabaq.numberOfLines || 0,
                completed: progress.sabaq.completed
            },
            manzil: {
                quality: progress.manzil.quality || 0,
                completed: progress.manzil.completed
            }
        }));

        // Calculate averages
        const totalDays = weeklyProgress.length;
        const avgLines = totalDays > 0 
            ? (weeklyProgress.reduce((acc, curr) => acc + (curr.sabaq.numberOfLines || 0), 0) / totalDays).toFixed(1)
            : 0;
        const avgManzilQuality = totalDays > 0
            ? (weeklyProgress.reduce((acc, curr) => acc + (curr.manzil.quality || 0), 0) / totalDays).toFixed(1)
            : 0;

        res.status(200).json({
            success: true,
            data: {
                dailyProgress: formattedData,
                summary: {
                    averageLines: avgLines,
                    averageManzilQuality: avgManzilQuality
                }
            }
        });
    } catch (error) {
        console.error('Error fetching weekly progress:', error);
        res.status(500).json({ message: "Server error." });
    }
};

// Get current Juzz info
const getCurrentJuzzInfo = async (req, res) => {
    const studentId = req.user.id;
    
    try {
        // Get the most recent progress entry that has sabaq data
        const latestProgress = await Progress.findOne({ 
            studentId,
            'sabaq.completed': true 
        }).sort({ date: -1 });

        if (!latestProgress) {
            return res.status(404).json({ 
                message: "No juzz information found." 
            });
        }

        res.status(200).json({
            success: true,
            data: {
                currentJuzz: latestProgress.sabqi.juzz // Assuming current Juzz is tracked in sabqi
            }
        });
    } catch (error) {
        console.error('Error fetching current juzz info:', error);
        res.status(500).json({ message: "Server error." });
    }
};

module.exports = {
    getTodayProgress,
    getWeeklyProgress,
    getCurrentJuzzInfo,
    viewProgress ,
    getAttendance};

