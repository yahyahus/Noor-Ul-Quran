const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Progress = require('../models/Progress');
const { getWorkingDays } = require('./generalController');

const assignStudentToTeacher = async (req, res) => {
  const { studentId, teacherId } = req.body;

  try {
      const teacher = await User.findById(teacherId);
      const student = await User.findById(studentId);

      if (!teacher || !student) {
          return res.status(404).json({ message: 'Teacher or student not found' });
      }

      // Initialize studentInfo if it doesn't exist
      if (!student.studentInfo) {
          student.studentInfo = {};
      }

      // Assign the teacherId to the student
      student.studentInfo.teacherId = teacherId;

      // Add student to teacher's student list
      if (!teacher.teacherInfo) {
          teacher.teacherInfo = { students: [] };
      }
      teacher.teacherInfo.students.push(student._id);

      // Save the changes
      await student.save();
      await teacher.save();

      res.status(200).json({ message: 'Student assigned to teacher successfully' });
  } catch (error) {
      console.error('Error assigning student to teacher:', error);
      res.status(500).json({ message: 'Error assigning student to teacher' });
  }
};

const getStudentsForTeacher = async (req, res) => {
  try {
    const teacherId = req.user.id; 
    const teacher = await User.findById(teacherId).populate('teacherInfo.students');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Map over students to extract names
    const studentNames = teacher.teacherInfo.students.map(student => ({
      firstname: student.firstname,
      lastname: student.lastname,
    }));

    res.status(200).json(studentNames);
  } catch (error) {
    console.error('Error fetching students for teacher:', error); 
    res.status(500).json({ message: 'Server error' });
  }
};
const markAttendance = async (req, res) => {
  const { studentId, date, status } = req.body; 
  const teacherId = req.user.id; 

  try {
    const student = await User.findById(studentId);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.studentInfo.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: 'Student is not assigned to you' });
    }

    // Treat the date as a string to avoid any timezone conversion
    const existingAttendance = await Attendance.findOne({
      studentId,
      teacherId,
      date, // Just compare as string
    });

    if (existingAttendance) {
      await Attendance.findOneAndUpdate(
        { studentId, teacherId, date },
        { status }
      );
      res.status(200).json({ message: 'Attendance updated successfully' });
    } else {
      await Attendance.create({
        studentId,
        teacherId,
        date, // Store as string
        status,
      });

      console.log(`Attendance marked for student ${studentId} on ${date}`);
      res.status(200).json({ message: 'Attendance marked successfully' });
    }
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMonthlyAttendance = async (req, res) => {
  const { month, year } = req.query;
  const teacherId = req.user.id;

  try {
    // Get all working days once
    const workingDays = await getWorkingDays(month, year);
    const normalizedWorkingDays = workingDays.map(date => new Date(date).toISOString().split('T')[0]); 

    // Fetch all students assigned to the teacher
    const teacher = await User.findById(teacherId).populate('teacherInfo.students');
    const studentIds = teacher.teacherInfo.students.map(student => student._id);

    // Fetch attendance for all students in a single query
    const attendanceRecords = await Attendance.find({
      studentId: { $in: studentIds },
      teacherId,
      date: { $in: normalizedWorkingDays }
    }).lean(); // Use lean() for better performance

    // Convert attendance records into a map for quick lookup
    const attendanceMap = new Map();
    attendanceRecords.forEach(attendance => {
      const key = `${attendance.studentId}-${attendance.date}`;
      attendanceMap.set(key, attendance.status);
    });

    // Structure the response
    const students = teacher.teacherInfo.students.map(student => ({
      id: student._id,
      name: `${student.firstname} ${student.lastname}`,
      attendance: normalizedWorkingDays.map(date => ({
        date,
        status: attendanceMap.get(`${student._id}-${date}`) || "Not Marked"
      }))
    }));

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching monthly attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const markSabaq = async (req, res) => {
  const { studentId, date, sabaq: sabaqDetails } = req.body;
  const teacherId = req.user.id;

  try {
    // Validate student
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (student.studentInfo.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: 'Student is not assigned to you' });
    }

    // Use findOneAndUpdate to either update existing or create new
    const progress = await Progress.findOneAndUpdate(
      { studentId, teacherId, date },
      {
        $setOnInsert: {
          studentId,
          teacherId,
          date,
          sabqi: null,
          manzil: null
        },
        $set: {
          sabaq: {
            completed: sabaqDetails.completed,
            numberOfLines: parseInt(sabaqDetails.numberOfLines, 10),
            startingSurah: {
              number: parseInt(sabaqDetails.startingSurahNumber, 10),
              name: sabaqDetails.startingSurah,
            },
            endingSurah: {
              number: parseInt(sabaqDetails.endingSurahNumber, 10),
              name: sabaqDetails.endingSurah,
            },
            startingAyah: parseInt(sabaqDetails.startingAyah, 10),
            endingAyah: parseInt(sabaqDetails.endingAyah, 10),
            remarks: sabaqDetails.remarks,
          }
        }
      },
      {
        new: true, // Return the updated document
        upsert: true // Create if doesn't exist
      }
    );

    res.status(200).json({
      message: 'Sabaq marked successfully',
      progress
    });

  } catch (error) {
    console.error('Error marking sabaq:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const markSabqi = async (req, res) => {
  const { studentId, date, sabqi: sabqiDetails } = req.body;
  const teacherId = req.user.id;

  try {
    // Validate student
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (student.studentInfo.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: 'Student is not assigned to you' });
    }

    const progress = await Progress.findOneAndUpdate(
      { studentId, teacherId, date },
      {
        $setOnInsert: {
          studentId,
          teacherId,
          date,
          sabaq: null,
          manzil: null
        },
        $set: {
          sabqi: {
            completed: sabqiDetails.completed,
            juzz: {
              number: sabqiDetails.juzz.number,
              name: sabqiDetails.juzzName
            },
            quality: sabqiDetails.quality,
            remarks: sabqiDetails.remarks
          }
        }
      },
      {
        new: true,
        upsert: true
      }
    );

    res.status(200).json({
      message: 'Sabqi marked successfully',
      progress
    });

  } catch (error) {
    console.error('Error marking sabqi:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const markManzil = async (req, res) => {
  const { studentId, date, manzil: manzilDetails } = req.body;
  const teacherId = req.user.id;

  try {
    // Validate student
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    if (student.studentInfo.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: 'Student is not assigned to you' });
    }

    const progress = await Progress.findOneAndUpdate(
      { studentId, teacherId, date },
      {
        $setOnInsert: {
          studentId,
          teacherId,
          date,
          sabaq: null,
          sabqi: null
        },
        $set: {
          manzil: {
            completed: manzilDetails.completed,
            juzz: {
              number: manzilDetails.juzz.number,
              name: manzilDetails.juzzName
            },
            quality: manzilDetails.quality,
            remarks: manzilDetails.remarks
          }
        }
      },
      {
        new: true,
        upsert: true
      }
    );

    res.status(200).json({
      message: 'Manzil marked successfully',
      progress
    });

  } catch (error) {
    console.error('Error marking manzil:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMonthlyProgress = async (req, res) => {
  const { month, year } = req.query;
  const teacherId = req.user.id;

  try {
    const workingDays = await getWorkingDays(month, year);

    const students = [];
    const teacher = await User.findById(teacherId).populate('teacherInfo.students');

    for (const student of teacher.teacherInfo.students) {
      const studentProgress = {
        id: student._id,
        name: `${student.firstname} ${student.lastname}`,
        progress: []
      };

      for (const date of workingDays) {
        const normalizedDate = new Date(date).toISOString().split('T')[0];

        const progress = await Progress.findOne({
          studentId: student._id,
          teacherId,
          date: normalizedDate
        });

        if (progress) {
          studentProgress.progress.push({
            date: normalizedDate,
            sabaq: progress.sabaq,
            sabqi: progress.sabqi,
            manzil: progress.manzil
          });
        }
      }
      students.push(studentProgress);
    }

    res.status(200).json({ students });
  }
  catch (error) {
    console.error('Error fetching monthly progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudentsProgressForDate = async (req, res) => {
  try {
    const teacherId = req.user.id; // Assuming the teacher is authenticated
    const { date } = req.query; // Date provided in the query parameters

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // Fetch the teacher and their students
    const teacher = await User.findById(teacherId).populate('teacherInfo.students');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Extract student IDs and details
    const students = teacher.teacherInfo.students.map(student => ({
      _id: student._id,
      firstname: student.firstname,
      lastname: student.lastname,
    }));

    // Fetch progress for all students for the specified date
    const progressData = await Progress.find({
      teacherId,
      studentId: { $in: students.map(student => student._id) },
      date,
    }).populate('studentId', 'firstname lastname'); // Populate student details if needed

    // Standardize the response format
    const result = students.map(student => {
      const studentProgress = progressData.find(
        progress => progress.studentId._id.toString() === student._id.toString()
      );

      return {
        studentId: student._id,
        firstname: student.firstname,
        lastname: student.lastname,
        date, // The date being queried
        sabaq: studentProgress?.sabaq?.completed
          ? {
              completed: true,
              startingSurah: studentProgress.sabaq.startingSurah,
              endingSurah: studentProgress.sabaq.endingSurah,
              numberOfLines: studentProgress.sabaq.numberOfLines,
              startingAyah: studentProgress.sabaq.startingAyah,
              endingAyah: studentProgress.sabaq.endingAyah,
              remarks: studentProgress.sabaq.remarks,
            }
          : { completed: false },
        sabqi: studentProgress?.sabqi?.completed
          ? {
              completed: true,
              juzz: studentProgress.sabqi.juzz,
              quality: studentProgress.sabqi.quality,
              remarks: studentProgress.sabqi.remarks,
            }
          : { completed: false },
        manzil: studentProgress?.manzil?.completed
          ? {
              completed: true,
              juzz: studentProgress.manzil.juzz,
              quality: studentProgress.manzil.quality,
              remarks: studentProgress.manzil.remarks,
            }
          : { completed: false },
      };
    });

    //logging the result
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching progress data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTeacherDashboardStats = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

    // Get teacher info with students
    const teacher = await User.findById(teacherId).populate('teacherInfo.students');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const studentIds = teacher.teacherInfo.students.map(student => student._id);
    const totalStudents = studentIds.length;

    const allTodayProgress = await Progress.find({
      teacherId,
      studentId: { $in: studentIds },
      date: today
    });
    
    // Create a set of student IDs who have any progress entry today
    const studentsWithProgressToday = new Set(
      allTodayProgress.map(progress => progress.studentId.toString())
    );
    
    // Count students with completed sabaq
    const completedSabaqCount = allTodayProgress.filter(progress => 
      progress.sabaq && progress.sabaq.completed === true
    ).length;
    
    // pendingSabaq = students with no progress + students with incomplete progress
    const pendingSabaq = totalStudents - completedSabaqCount;
    
    console.log(pendingSabaq);
    // Find the top performing student
    // We'll calculate based on sabaq lines and quality ratings from the past week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoString = oneWeekAgo.toISOString().split('T')[0];

    // Get all student progress from past week
    const weekProgress = await Progress.find({
      teacherId,
      studentId: { $in: studentIds },
      date: { $gte: oneWeekAgoString }
    }).populate('studentId', 'firstname lastname');

    // Calculate student performance
    const studentPerformance = {};
    weekProgress.forEach(progress => {
      const studentId = progress.studentId._id.toString();
      
      if (!studentPerformance[studentId]) {
        studentPerformance[studentId] = {
          id: studentId,
          name: `${progress.studentId.firstname} ${progress.studentId.lastname}`,
          totalLines: 0,
          sabqiCompleted: false,
          manzilRating: 0,
          entriesCount: 0
        };
      }

      // Sum up performance metrics
      if (progress.sabaq && progress.sabaq.numberOfLines) {
        studentPerformance[studentId].totalLines += progress.sabaq.numberOfLines;
      }

      if (progress.sabqi && progress.sabqi.completed) {
        studentPerformance[studentId].sabqiCompleted = true;
      }

      if (progress.manzil && progress.manzil.quality) {
        studentPerformance[studentId].manzilRating += progress.manzil.quality;
        studentPerformance[studentId].entriesCount++;
      }
    });

    // Find the top performer
    let topPerformer = null;
    let highestScore = -1;

    Object.values(studentPerformance).forEach(student => {
      // Calculate average manzil rating
      const avgManzilRating = student.entriesCount > 0 
        ? student.manzilRating / student.entriesCount 
        : 0;

      // Simple scoring: totalLines + (avgManzilRating * 5) + (sabqiCompleted ? 10 : 0)
      const score = student.totalLines + (avgManzilRating * 5) + (student.sabqiCompleted ? 10 : 0);
      
      if (score > highestScore) {
        highestScore = score;
        topPerformer = {
          name: student.name,
          sabaqLines: student.totalLines,
          sabqiCompleted: student.sabqiCompleted,
          manzilRating: avgManzilRating.toFixed(1)
        };
      }
    });

    res.status(200).json({
      name: `${teacher.firstname} ${teacher.lastname}`,
      totalStudents,
      pendingSabaq,
      topPerformer: topPerformer || {
        name: "No data available",
        sabaqLines: 0,
        sabqiCompleted: false,
        manzilRating: 0
      }
    });
  } catch (error) {
    console.error('Error fetching teacher dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



const getTodayStudentProgress = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

    // Get all students assigned to this teacher
    const teacher = await User.findById(teacherId).populate('teacherInfo.students');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const studentIds = teacher.teacherInfo.students.map(student => student._id);
    
    // Get today's progress for all students in one query
    const progressRecords = await Progress.find({
      teacherId,
      studentId: { $in: studentIds },
      date: today
    }).populate('studentId', 'firstname lastname');

    // Create a map for quick lookups
    const progressMap = new Map(
      progressRecords.map(record => [record.studentId._id.toString(), record])
    );

    // Prepare the response data
    const studentsProgress = teacher.teacherInfo.students.map(student => {
      const progress = progressMap.get(student._id.toString());
      
      return {
        name: `${student.firstname} ${student.lastname}`,
        sabaq: progress?.sabaq ? {
          current: progress.sabaq.numberOfLines || 0,
          target: progress.sabaq.startingSurah && progress.sabaq.endingSurah ? 
            `Verse ${progress.sabaq.startingAyah}-${progress.sabaq.endingAyah}, Page ${progress.sabaq.startingSurah.number}` :
            "Not set"
        } : { current: 0, target: "Not recorded" },
        sabqi: progress?.sabqi?.quality || 0,
        manzil: progress?.manzil ? {
          juzz: progress.manzil.juzz?.number || 0,
          rating: progress.manzil.quality || 0
        } : { juzz: 0, rating: 0 }
      };
    });

    res.status(200).json(studentsProgress);
  } catch (error) {
    console.error('Error fetching today\'s student progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  getStudentsForTeacher, 
  assignStudentToTeacher, 
  markAttendance, 
  getMonthlyAttendance, 
  markSabaq, 
  markSabqi, 
  markManzil, 
  getMonthlyProgress, 
  getStudentsProgressForDate, 
  getTeacherDashboardStats, 
  getTodayStudentProgress
};
