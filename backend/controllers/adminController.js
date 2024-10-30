const User = require('../models/User');
const Holiday = require('../models/Holiday');
 

const getUnassignedStudents = async (req, res) => {
    try {
        const students = await User.find({
            role: 'student',
            'studentInfo.teacherId': null,
        });

        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching unassigned students:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getTeachers = async (req, res) => {
    try {
        const teachers = await User.find({
            role: 'teacher',
        });

        res.status(200).json(teachers);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const assignStudent = async (req, res) => {
    const { studentId, teacherId } = req.body;

    try {
        const student = await User.findById({ _id: studentId });
        const teacher = await User.findById({ _id: teacherId });

        if (!student || !teacher) {
            console.error('Student or teacher not found');
            return res.status(404).json({ message: 'Student or teacher not found' });
        }

        if (student.studentInfo.teacherId) 
        {
            //update the studentinfo to the new teacher & teacherInfo of the old teacher to remove the student & add the student to the new teacher
            const oldTeacher = await User.findById(student.studentInfo.teacherId);
            oldTeacher.teacherInfo.students = oldTeacher.teacherInfo.students.filter(
                (id) => id.toString() !== studentId
            );
            await oldTeacher.save();
            teacher.teacherInfo.students.push(studentId);
            student.studentInfo.teacherId = teacherId;
            await Promise.all([student.save(), teacher.save(), oldTeacher.save()]);

            res.status(200).json({ message: 'Student assigned successfully' });

        }
        else
        {
            //if the student already exists in the teacherInfo, return an error
            if (teacher.teacherInfo.students.includes(studentId)) {
                console.error('Student already assigned to teacher');
                return res.status(400).json({ message: 'Student already assigned to teacher' });
            }
            teacher.teacherInfo.students.push(studentId);
            student.studentInfo.teacherId = teacherId;
            await Promise.all([student.save(), teacher.save()]);

            res.status(200).json({ message: 'Student assigned successfully' });
        }
    }
    catch (error) {
        console.error('Error assigning student:', error);
        res.status(500).json({ message: 'Server error' });
    }

};
const addHoliday = async (req, res) => {
    const { date, description, isWeekendOpen } = req.body;

    try {
        // Split the input date to 'YYYY-MM-DD' format
        const [year, month, day] = date.split('-');
        
        // Create a date object using UTC
        const holidayDate = new Date(Date.UTC(year, month - 1, day)).toISOString().split('T')[0];
        

        // Check if the holiday already exists
        const existingHoliday = await Holiday.findOne({ date: holidayDate });
        if (existingHoliday) {
            return res.status(400).json({ message: 'Holiday already exists on this date.' });
        }

        // Create a new holiday
        const newHoliday = new Holiday({
            date: holidayDate, // Store date directly as string
            description: description || '', // Optional description
            isHoliday: true,  // Default to true since it's a holiday
            isWeekendOpen: isWeekendOpen || false, // Optional field for marking certain weekends as working
        });

        // Save the holiday to the database
        await newHoliday.save();

        res.status(201).json({ message: 'Holiday added successfully', holiday: newHoliday });
    } catch (error) {
        console.error('Error adding holiday:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
const createStudent = async (req, res) => {
    const { username, password, firstname, lastname, role = 'student' } = req.body;

    // Basic validation
    if (!username || !password || !firstname || !lastname) {
        return res.status(400).json({ message: 'All fields are required: username, password, firstname, lastname' });
    }

    try {
        // Check if a user with the same username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        // Create new user with the role defaulting to teacher
        const newUser = new User({
            username,
            password, // Ideally, hash the password before saving
            firstname,
            lastname,
            role
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const createStudent = async (req, res) => {
    const { name, email, password, role, teacherId } = req.body;

    try {
        const user = new User({ 
            name,
            email,
            password,
            role,
            studentInfo: {           
                teacherId: teacherId || null,
            },
        });
       

        await user.save();

        if (teacherId) {
            const teacher = await User.findById(teacherId);

            if (teacher) {
                teacher.teacherInfo.students.push(user._id);
                await teacher.save();
            }
            else {
                console.error('Teacher not found');
                return res.status(404).json({ message: 'Teacher not found' });
            }
        }

        res.status(201).json({ message: 'Student added successfully', student: user });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ message: 'Server error' });
    }
}


module.exports = {
    getUnassignedStudents, getTeachers, assignStudent, addHoliday, createStudent
};