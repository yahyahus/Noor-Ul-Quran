import React, { useState, useEffect } from 'react';
import { getAttendance, markAttendance } from '../services/teacherService';  // Import markAttendance function

const MarkAttendance = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);  // Default: current month
    const [year, setYear] = useState(new Date().getFullYear());     // Default: current year
    const [attendanceData, setAttendanceData] = useState([]);
    const [editingCell, setEditingCell] = useState({ studentId: null, date: null });  // Track which cell is being edited
    const [attendanceOptions] = useState(['present', 'absent', 'Leave', 'Not Marked']); // Dropdown options

    const fetchAttendance = async () => {
        try {
            const data = await getAttendance(month, year);  // Call getAttendance with month and year
            setAttendanceData(data.students);
        } catch (error) {
            console.error('Failed to fetch attendance:', error);
        }
    };

    useEffect(() => {
        fetchAttendance();  // Fetch attendance on component mount and when month/year changes
    }, [month, year]);

    const handleMonthChange = (e) => setMonth(e.target.value);
    const handleYearChange = (e) => setYear(e.target.value);

    // Function to handle marking attendance
    const handleMarkAttendance = async (studentId, date, status) => {
        try {
            await markAttendance(studentId, date, status);  // Send data to the backend
            // Update attendance in UI
            setAttendanceData((prevData) =>
                prevData.map((student) =>
                    student.id === studentId
                        ? {
                            ...student,
                            attendance: student.attendance.map((att) =>
                                att.date === date ? { ...att, status } : att
                            ),
                        }
                        : student
                )
            );
            setEditingCell({ studentId: null, date: null });  // Close dropdown
        } catch (error) {
            console.error('Failed to mark attendance:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Mark Attendance</h2>

            {/* Month and Year dropdowns */}
            <div className="flex space-x-4 mb-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Month:</label>
                    <select
                        value={month}
                        onChange={handleMonthChange}
                        className="block w-full p-2 border rounded-md bg-gray-100 text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        {[...Array(12).keys()].map((m) => (
                            <option key={m + 1} value={m + 1}>
                                {new Date(0, m).toLocaleString('en-US', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Year:</label>
                    <select
                        value={year}
                        onChange={handleYearChange}
                        className="block w-full p-2 border rounded-md bg-gray-100 text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        {[...Array(5).keys()].map((y) => (
                            <option key={y + year - 2} value={y + year - 2}>
                                {y + year - 2}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Display attendance data */}
            <div className="overflow-x-auto">
                {attendanceData.length === 0 ? (
                    <p className="text-gray-500">No attendance data found.</p>
                ) : (
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b">Student Name</th>
                                {attendanceData[0].attendance.map((day) => (
                                    <th key={day.date} className="py-2 px-4 border-b">
                                        {new Date(day.date).toLocaleDateString()}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map((student) => (
                                <tr key={student.id} className="text-center">
                                    <td className="py-2 px-4 border-b">{student.name}</td>
                                    {student.attendance.map((att) => (
                                        <td
                                            key={att.date}
                                            className={`py-2 px-4 border-b ${att.status === 'present' ? 'bg-green-100' : att.status === 'absent' ? 'bg-red-100' : 'bg-yellow-100'}`}
                                            onClick={() => setEditingCell({ studentId: student.id, date: att.date })}
                                        >
                                            {/* Check if the cell is being edited */}
                                            {editingCell.studentId === student.id && editingCell.date === att.date ? (
                                                <select
                                                    className="block w-full p-1 border rounded-md"
                                                    value={att.status}
                                                    onChange={(e) => handleMarkAttendance(student.id, att.date, e.target.value)}
                                                >
                                                    {attendanceOptions.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                att.status
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MarkAttendance;
