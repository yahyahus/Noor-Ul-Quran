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
  const { studentId, date, sabaq: sabaqDetails } = req.body; // Directly take `sabaqDetails` from request body
  const teacherId = req.user.id;

  // Logging the sabaq details received from the frontend
  console.log('Received sabaq details:', sabaqDetails);

  try {
    // Ensure the student exists and has the role 'student'
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the student is assigned to the logged-in teacher
    if (student.studentInfo.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: 'Student is not assigned to you' });
    }

    // Find the existing progress document for the given student and date
    const existingProgress = await Progress.findOne({ studentId, teacherId, date });

    if (existingProgress) {
      // If sabaq already exists, return it without modifying
      return res.status(200).json({
        message: 'Sabaq already exists for this date',
        sabaq: existingProgress.sabaq,
      });
    }

    // Create a new progress document with sabaq details
    const newProgress = await Progress.create({
      studentId,
      teacherId,
      date,
      sabaq: {
        completed: sabaqDetails.completed,
        numberOfLines: parseInt(sabaqDetails.numberOfLines, 10), // Convert to number
        startingSurah: {
          number: parseInt(sabaqDetails.startingSurahNumber, 10), // Explicitly map number
          name: sabaqDetails.startingSurah,
        },
        endingSurah: {
          number: parseInt(sabaqDetails.endingSurahNumber, 10), // Explicitly map number
          name: sabaqDetails.endingSurah,
        },
        startingAyah: parseInt(sabaqDetails.startingAyah, 10), // Convert to number
        endingAyah: parseInt(sabaqDetails.endingAyah, 10), // Convert to number
        remarks: sabaqDetails.remarks,
      },
      sabqi: null, // Initialize sabqi and manzil as null
      manzil: null,
    });

    // Respond with success
    res.status(201).json({
      message: 'Sabaq marked successfully',
      progress: newProgress,
    });

    // Logging the new progress created
    console.log('New progress logged:', newProgress);
  } catch (error) {
    console.error('Error marking sabaq:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// const markSabqi = async (req, res) => {
//   const {
//     studentId,
//     date,
//     sabqi: { completed, juzz, quality, remarks }, // Accept sabqi details from the request body
//   } = req.body;
//   const teacherId = req.user.id;

//   try {
//     // Ensure the student exists and has the role 'student'
//     const student = await User.findById(studentId);
//     if (!student || student.role !== 'student') {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     // Check if the student is assigned to the logged-in teacher
//     if (student.studentInfo.teacherId.toString() !== teacherId) {
//       return res.status(403).json({ message: 'Student is not assigned to you' });
//     }

//     // Find the existing progress document for the given student and date
//     const existingProgress = await Progress.findOne({ studentId, teacherId, date });

//     if (existingProgress) {
//       // Update the sabqi details for the existing document
//       existingProgress.sabqi = {
//         completed,
//         juzz,
//         quality,
//         remarks,
//       };
//       await existingProgress.save();
//       res.status(200).json({ message: 'Sabqi progress updated successfully', progress: existingProgress });
//     } else {
//       // Create a new progress document for the student and date
//       const newProgress = await Progress.create({
//         studentId,
//         teacherId,
//         date,
//         sabaq: null, // Initialize sabaq as null
//         sabqi: {
//           completed,
//           juzz,
//           quality,
//           remarks,
//         },
//         manzil: null, // Initialize manzil as null
//       });

//       res.status(201).json({ message: 'Sabqi progress marked successfully', progress: newProgress });
//     }
//   } catch (error) {
//     console.error('Error marking sabqi progress:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

//re-writing the markSabqi function but now with juzzName also present in the request body
//the db schema has the following structure for sabqi:
/*  sabqi: {
    completed : Boolean, 
    juzz: {
      number : Number,
      name : String,
    },
    quality: Number,
    remarks: String, 
  },
*/
// Now, re-writing the modified markSabqi function
const markSabqi = async (req, res) => {
  const { studentId, date, sabqi: sabqiDetails } = req.body;
  const teacherId = req.user.id;

  try {
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.studentInfo.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: 'Student is not assigned to you' });
    }
    const existingProgress = await Progress.findOne({ student : studentId, teacherId, date });

    if (existingProgress) {
      existingProgress.sabqi = { 
        completed: sabqiDetails.completed,
        juzz: {
          number: sabqiDetails.juzz.number,
          name: sabqiDetails.juzzName
        },
        quality: sabqiDetails.quality,
        remarks: sabqiDetails.remarks
      };
      await existingProgress.save();
      res.status(200).json({ message: 'Sabqi progress updated successfully', progress: existingProgress });
    } else {
      const newProgress = await Progress.create({
        studentId,
        teacherId,
        date,
        sabaq: null,
        sabqi: {
          completed: sabqiDetails.completed,
          juzz: {
            number: sabqiDetails.juzz.number,
            name: sabqiDetails.juzzName
          },
          quality: sabqiDetails.quality,
          remarks: sabqiDetails.remarks
        },
        manzil: null
      });
      res.status(201).json({ message: 'Sabqi progress marked successfully', progress: newProgress });
    }
  } catch (error) {
    console.error('Error marking sabqi progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// const markManzil = async (req, res) => {
//   const {
//     studentId,
//     date,
//     manzil: { completed, juzz, quality, remarks }, // Accept manzil details from the request body
//   } = req.body;
//   const teacherId = req.user.id;

//   try {
//     // Ensure the student exists and has the role 'student'
//     const student = await User.findById(studentId);
//     if (!student || student.role !== 'student') {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     // Check if the student is assigned to the logged-in teacher
//     if (student.studentInfo.teacherId.toString() !== teacherId) {
//       return res.status(403).json({ message: 'Student is not assigned to you' });
//     }

//     // Find the existing progress document for the given student and date
//     const existingProgress = await Progress.findOne({ studentId, teacherId, date });

//     if (existingProgress) {
//       // Update the manzil details for the existing document
//       existingProgress.manzil = {
//         completed,
//         juzz,
//         quality,
//         remarks,
//       };
//       await existingProgress.save();
//       res.status(200).json({ message: 'Manzil progress updated successfully', progress: existingProgress });
//     } else {
//       // Create a new progress document for the student and date
//       const newProgress = await Progress.create({
//         studentId,
//         teacherId,
//         date,
//         sabaq: null,
//         sabqi: null,
//         manzil: {
//           completed,
//           juzz,
//           quality,
//           remarks,
//         },
//       });

//       res.status(201).json({ message: 'Manzil progress marked successfully', progress: newProgress });
//     }
//   } catch (error) {
//     console.error('Error marking manzil progress:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

//re-writing the markManzil function but now with juzzName also present in the request body
//the db schema has the following structure for manzil:
/* manzil: {
    completed : Boolean, 
    juzz : {
      number : Number,
      name : String,
    },
    quality: Number,
    remarks: String,
  },
*/
// Now, re-writing the modified markManzil function

const markManzil = async (req, res) => {
  const { student, date, manzil: manzilDetails } = req.body;
  const teacherId = req.user.id;

  //writing a similar code as markSabqi function
  try {
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.studentInfo.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: 'Student is not assigned to you' });
    }
    const existingProgress = await Progress.findOne({ student : studentId, teacherId, date });

    if (existingProgress) {
      existingProgress.manzil = { 
        completed: manzilDetails.completed,
        juzz : {
          number: manzilDetails.juzz.number,
          name: manzilDetails.juzzName
        },
        quality: manzilDetails.quality,
        remarks: manzilDetails.remarks
      };
      await existingProgress.save();
      res.status(200).json({ message: 'Manzil progress updated successfully', progress: existingProgress });
    } else {
      const newProgress = await Progress.create({
        studentId,
        teacherId,
        date,
        sabaq: null,
        sabqi: null,
        manzil: {
          completed: manzilDetails.completed,
          juzz : {
            number: manzilDetails.juzz.number,
            name: manzilDetails.juzzName
          },
          quality: manzilDetails.quality,
          remarks: manzilDetails.remarks
        }
      });
      res.status(201).json({ message: 'Manzil progress marked successfully', progress: newProgress });
    }
  } catch (error) 
  {
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
