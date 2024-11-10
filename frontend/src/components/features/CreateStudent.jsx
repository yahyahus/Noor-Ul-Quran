import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStudent } from '../services/adminService';
import { createTeacher } from '../services/adminService'; // Assuming you have a createTeacher function
import Header from '../Header';
import Navbar from '../Navbar';

const CreateUser = () => {
    const [studentFirstname, setStudentFirstname] = useState('');
    const [studentLastname, setStudentLastname] = useState('');
    const [studentUsername, setStudentUsername] = useState('');
    const [studentPassword, setStudentPassword] = useState('');
    const [teacherFirstname, setTeacherFirstname] = useState('');
    const [teacherLastname, setTeacherLastname] = useState('');
    const [teacherUsername, setTeacherUsername] = useState('');
    const [teacherPassword, setTeacherPassword] = useState('');
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCreateStudent = async () => {
        if (!studentFirstname || !studentLastname || !studentUsername || !studentPassword) {
            setError("All student fields are required.");
            return;
        }

        setError('');
        const result = await createStudent(studentUsername, studentPassword, studentFirstname, studentLastname);
        
        if (result.success) {
            setResponse('Student created successfully!');
            navigate('/portal'); // Redirect to portal or another page if successful
        } else {
            setResponse(result.message || 'Failed to create student.');
        }
    };

    const handleCreateTeacher = async () => {
        if (!teacherFirstname || !teacherLastname || !teacherUsername || !teacherPassword) {
            setError("All teacher fields are required.");
            return;
        }

        setError('');
        const result = await createTeacher(teacherUsername, teacherPassword, teacherFirstname, teacherLastname);
        
        if (result.success) {
            setResponse('Teacher created successfully!');
            navigate('/portal'); // Redirect to portal or another page if successful
        } else {
            setResponse(result.message || 'Failed to create teacher.');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Header />
            <div className="flex flex-1">
                <Navbar />
                <main className="flex-1 p-8 overflow-auto">
                    <h2 className="text-3xl font-semibold mb-6 text-gray-800">Create User</h2>
                    <div className="flex space-x-8">
                        {/* Create Student Form */}
                        <div className="w-1/2 p-8 bg-white rounded-lg shadow-xl transform transition-all hover:scale-105">
                            <h3 className="text-2xl font-bold text-center mb-6 text-black-600">Create New Student</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={studentFirstname}
                                    onChange={(e) => setStudentFirstname(e.target.value)}
                                    className="w-full p-3 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={studentLastname}
                                    onChange={(e) => setStudentLastname(e.target.value)}
                                    className="w-full p-3 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={studentUsername}
                                    onChange={(e) => setStudentUsername(e.target.value)}
                                    className="w-full p-3 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={studentPassword}
                                    onChange={(e) => setStudentPassword(e.target.value)}
                                    className="w-full p-3 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                <button
                                    onClick={handleCreateStudent}
                                    className="w-full py-2 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                                >
                                    Create Student
                                </button>
                            </div>
                        </div>

                        {/* Create Teacher Form */}
                        <div className="w-1/2 p-8 bg-white rounded-lg shadow-xl transform transition-all hover:scale-105">
                            <h3 className="text-2xl font-bold text-center mb-6 text-black-600">Create New Teacher</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={teacherFirstname}
                                    onChange={(e) => setTeacherFirstname(e.target.value)}
                                    className="w-full p-3 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={teacherLastname}
                                    onChange={(e) => setTeacherLastname(e.target.value)}
                                    className="w-full p-3 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={teacherUsername}
                                    onChange={(e) => setTeacherUsername(e.target.value)}
                                    className="w-full p-3 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={teacherPassword}
                                    onChange={(e) => setTeacherPassword(e.target.value)}
                                    className="w-full p-3 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                                <button
                                    onClick={handleCreateTeacher}
                                    className="w-full py-2 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all duration-200"
                                >
                                    Create Teacher
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-center text-red-500 mt-4">{error}</p>}
                    {response && <p className="text-center text-teal-600 mt-4">{response}</p>}
                </main>
            </div>
        </div>
    );
}

export default CreateUser;
