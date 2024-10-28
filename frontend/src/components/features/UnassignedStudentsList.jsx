import React, { useEffect, useState, useCallback } from 'react';
import { fetchUnassignedStudents, fetchTeachers, assignStudent } from '../services/adminService';
import Header from '../Header';
import Navbar from '../Navbar';

const UnassignedStudentsList = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [isAssignMode, setIsAssignMode] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [studentsData, teachersData] = await Promise.all([fetchUnassignedStudents(), fetchTeachers()]);
                setStudents(studentsData);
                setTeachers(teachersData);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCheckboxChange = useCallback((studentId) => {
        setSelectedStudents((prevSelected) =>
            prevSelected.includes(studentId)
                ? prevSelected.filter((id) => id !== studentId)
                : [...prevSelected, studentId]
        );
    }, []);

    const handleAssignClick = async () => {
        if (isAssignMode && selectedTeacher) {
            const response = await assignStudent(selectedStudents, selectedTeacher);
            if (response.ok) {
                const updatedStudents = students.filter((student) => !selectedStudents.includes(student._id));
                setStudents(updatedStudents);
                setSelectedStudents([]);
                setSelectedTeacher('');
                alert('Students assigned successfully');
            } else {
                console.error('Failed to assign student');
                console.log(response);
            }
        }
        setIsAssignMode(!isAssignMode);
    };

    const handleCancelClick = () => {
        setIsAssignMode(false);
        setSelectedStudents([]);
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <div className="flex flex-1">
                <Navbar />
                <main className="flex-1 p-8 bg-white shadow-md rounded-lg mx-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-semibold text-gray-700">Unassigned Students</h1>
                        <div>
                            {isAssignMode && (
                                <button
                                    onClick={handleCancelClick}
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded mr-2 shadow-md">
                                    Cancel
                                </button>
                            )}
                            <button
                                onClick={handleAssignClick}
                                className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md ${
                                    selectedStudents.length === 0 && isAssignMode ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={selectedStudents.length === 0 && isAssignMode}
                            >
                                {isAssignMode ? (teachers.length > 0 ? 'Assign' : 'Select Teacher') : 'Assign Students'}
                            </button>
                        </div>
                    </div>

                    <StudentTable
                        students={students}
                        isAssignMode={isAssignMode}
                        handleCheckboxChange={handleCheckboxChange}
                        selectedStudents={selectedStudents}
                    />

                    {isAssignMode && teachers.length > 0 && (
                        <TeacherSelect
                            teachers={teachers}
                            selectedTeacher={selectedTeacher}
                            setSelectedTeacher={setSelectedTeacher}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

const StudentTable = ({ students, isAssignMode, handleCheckboxChange, selectedStudents }) => (
    <table className="w-full bg-gray-50 shadow-md rounded-lg mt-4">
        <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
            <tr>
                {isAssignMode && <th className="p-3"></th>}
                <th className="text-left p-3">Firstname</th>
                <th className="text-left p-3">Lastname</th>
            </tr>
        </thead>
        <tbody className="text-gray-600 text-sm">
            {students.map((student) => (
                <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-100">
                    {isAssignMode && (
                        <td className="p-3 text-center">
                            <input
                                type="checkbox"
                                checked={selectedStudents.includes(student._id)}
                                onChange={() => handleCheckboxChange(student._id)}
                                className="text-blue-600 focus:ring-blue-500 rounded"
                            />
                        </td>
                    )}
                    <td className="p-3">{student.firstname}</td>
                    <td className="p-3">{student.lastname}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

const TeacherSelect = ({ teachers, selectedTeacher, setSelectedTeacher }) => (
    <div className="mt-6">
        <label htmlFor="teacherSelect" className="block text-sm font-medium text-gray-700 mb-1">Select Teacher:</label>
        <select
            id="teacherSelect"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="block w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 p-3"
        >
            <option value="">-- Select Teacher --</option>
            {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                    {teacher.firstname} {teacher.lastname}
                </option>
            ))}
        </select>
    </div>
);

export default UnassignedStudentsList;
