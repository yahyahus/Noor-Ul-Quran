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
    // Get the working days for the given month
    const workingDays = await getWorkingDays(month, year);

    // Create an array of students. Each student will have an object with their id, name, and an array of attendance for each working day
    const students = [];
    const teacher = await User.findById(teacherId).populate('teacherInfo.students');

    for (const student of teacher.teacherInfo.students) {
      const studentAttendance = {
        id: student._id,
        name: `${student.firstname} ${student.lastname}`,
        attendance: []
      };

      for (const date of workingDays) {
        // Convert working day strings to 'YYYY-MM-DD' format
        const normalizedDate = new Date(date).toISOString().split('T')[0]; 

        // Find the attendance for the student on the given date
        const attendance = await Attendance.findOne({
          studentId: student._id,
          teacherId,
          date: normalizedDate // Use normalizedDate to match the Attendance model format
        });

        if (attendance) {
          studentAttendance.attendance.push({
            date: normalizedDate,
            status: attendance.status
          });
        }
      }
      students.push(studentAttendance);
    }

    res.status(200).json({ students });
  }
  catch (error) {
    console.error('Error fetching monthly attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const markSabaq = async (req, res) => {
  const { studentId, date } = req.body; // Removed sabaq from here
  const teacherId = req.user.id;

  try {
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.studentInfo.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: 'Student is not assigned to you' });
    }

    const existingProgress = await Progress.findOne({
      studentId,
      teacherId,
      date
    });

    if (existingProgress) {
      // Toggle the boolean state for sabaq
      existingProgress.sabaq = !existingProgress.sabaq; // Flip the state
      await existingProgress.save(); // Save the updated record
      res.status(200).json({ message: 'Sabaq progress updated successfully'});
    } else {
      // Create a new record with all boolean values set to false
      await Progress.create({
        studentId,
        teacherId,
        date,
        sabaq: true, // Set the initial state for sabaq to true
        sabqi: false, // Initial state for sabqi
        manzil: false // Initial state for manzil
      });

      console.log(`Sabaq progress marked for student ${studentId} on ${date}`);
      res.status(200).json({ message: 'Sabaq progress marked successfully'});
    }
  } catch (error) {
    console.error('Error marking sabaq progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const markSabqi = async (req, res) => {
  const { studentId, date } = req.body;
  const teacherId = req.user.id;

  try {
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.studentInfo.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: 'Student is not assigned to you' });
    }

    const existingProgress = await Progress.findOne({
      studentId,
      teacherId,
      date
    });

    if (existingProgress) {
      existingProgress.sabqi = !existingProgress.sabqi; 
      await existingProgress.save();
      res.status(200).json({ message: 'Sabqi progress updated successfully'});
    } else {

      await Progress.create({
        studentId,
        teacherId,
        date,
        sabaq: false,
        sabqi: true,
        manzil: false
      });

      console.log(`Sabqi progress marked for student ${studentId} on ${date}`);
      res.status(200).json({ message: 'Sabqi progress marked successfully' });
    }
  } catch (error) {
    console.error('Error marking sabqi progress:', error);
    res.status(500).json({ message: 'Server error' });
  }

};

const markManzil = async (req, res) => {
  const { studentId, date } = req.body;
  const teacherId = req.user.id;

  try {
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.studentInfo.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: 'Student is not assigned to you' });
    }

    const existingProgress = await Progress.findOne({
      studentId,
      teacherId,
      date
    });

    if (existingProgress) {
      existingProgress.manzil = !existingProgress.manzil; 
      await existingProgress.save();
      res.status(200).json({ message: 'Manzil progress updated successfully'});
    } else {

      await Progress.create({
        studentId,
        teacherId,
        date,
        sabaq: false,
        sabqi: false,
        manzil: true
      });

      console.log(`Manzil progress marked for student ${studentId} on ${date}`);
      res.status(200).json({ message: 'Manzil progress marked successfully' });
    }
  } catch (error) {
    console.error('Error marking manzil progress:', error);
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



module.exports = { getStudentsForTeacher, assignStudentToTeacher, markAttendance, getMonthlyAttendance , markSabaq, markSabqi, markManzil, getMonthlyProgress };
