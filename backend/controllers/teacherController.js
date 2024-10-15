const User = require('../models/User');
const Attendance = require('../models/Attendance');
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
    console.error('Error fetching students for teacher:', error); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
};


const markAttendance = async (req, res) => {
  
  const { studentId, date, status } = req.body;
  const teacherId = req.user.id; // the teacher is authenticated 
  
  try 
  {
    const student = await User.findById(studentId);
    
    if (!student || student.role !== 'student') 
    {
      return res.status(404).json({ message: 'Student not found' });
    }
    // Check if the student is assigned to the teacher
    if (student.studentInfo.teacherId.toString() !== teacherId) 
    {
      return res.status(403).json({ message: 'Student is not assigned to you' });
    }

    //check if the attendance is already marked, if yes, then update the status else create a new attendance
    const existingAttendance = await Attendance.findOne({
      studentId,
      teacherId,
      date,
    });

    if (existingAttendance) 
    {
      existingAttendance.status = status;
      await existingAttendance.save();
      res.status(200).json({ message: 'Attendance updated successfully' });
    } 
    else 
    {
      await Attendance.create({
        studentId,
        teacherId,
        date,
        status,
      });
      res.status(200).json({ message: 'Attendance marked successfully' });
    }

    
  }
  catch (error) 
  {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const getMonthlyAttendance = async (req, res) => {
  const { month, year } = req.query;  // Take month and year as query params
  const teacherId = req.user.id;      // Teacher is authenticated
  
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
        // Normalize the date to 'YYYY-MM-DD' format to ignore time for comparison
        const normalizedDate = new Date(date).toISOString().split('T')[0];

        // Find the attendance for the student on the given date
        const attendance = await Attendance.findOne({
          studentId: student._id,
          teacherId,
          date: {
            $gte: new Date(normalizedDate + 'T00:00:00.000Z'),
            $lte: new Date(normalizedDate + 'T23:59:59.999Z')
          }
        });

        studentAttendance.attendance.push({
          date: normalizedDate,
          status: attendance ? attendance.status : 'Not Marked',
        });
      }

      students.push(studentAttendance);
    }

    res.status(200).json({ students });

  } catch (error) {
    console.error('Error fetching monthly attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


//How does getMonthlyAttendance return the attendance of all students for a given month?
// sample output of getMonthlyAttendance
// {
//   students: [
//     {
//       id: 'student1',
//       name: 'John Doe',
//       attendance: [
//         { date: '2022-01-01', status: 'P' },
//         { date: '2022-01-02', status: 'A' },
//         ...
//       ],
//     },
//     {
//       id: 'student2',
//       name: 'Jane Doe',
//       attendance: [
//         { date: '2022-01-01', status: 'P' },
//         { date: '2022-01-02', status: 'P' },
//         ...
//       ],
//     },
//     ...
//   ],
// }

module.exports = { getStudentsForTeacher, assignStudentToTeacher, markAttendance, getMonthlyAttendance };
