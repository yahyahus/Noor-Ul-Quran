// CreateStudent.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStudent } from '../services/adminService';

function CreateStudent() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCreateStudent = async () => {
        if (!firstname || !lastname || !username || !password) {
            setError("All fields are required.");
            return;
        }

        setError('');
        const result = await createStudent(username, password, firstname, lastname);
        
        if (result.success) {
            setResponse('Student created successfully!');
            navigate('/portal'); // Redirect to portal or another page if successful
        }
        else{
            setResponse(result.message || 'Failed to create student.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Create New Student</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleCreateStudent}
                        className="w-full py-2 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Create Student
                    </button>
                    {error && <p className="text-center text-red-500 mt-4">{error}</p>}
                    {response && <p className="text-center text-red-500">{response}</p>}
                </div>
            </div>
        </div>
    );
}

export default CreateStudent;
