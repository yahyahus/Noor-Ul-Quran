const User = require('../models/User');


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



module.exports = { getStudentsForTeacher, assignStudentToTeacher };
