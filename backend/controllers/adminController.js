const User = require('../models/User');

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

       

module.exports = {
    getUnassignedStudents, getTeachers, assignStudent
};