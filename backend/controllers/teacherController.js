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




module.exports = { getStudentsForTeacher, assignStudentToTeacher, markAttendance, getMonthlyAttendance , markSabaq, markSabqi, markManzil, getMonthlyProgress , getStudentsProgressForDate};
