import React, { useState, useEffect } from 'react';
import { getAttendance, markAttendance } from '../services/teacherService';
import { getWorkingDays } from '../services/generalService';
import Header from '../Header';
import Navbar from '../Navbar';

const MarkAttendance = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [attendanceData, setAttendanceData] = useState([]);
    const [editingCell, setEditingCell] = useState({ studentId: null, date: null });
    const [loading, setLoading] = useState(false);
    const [markingLoading, setMarkingLoading] = useState(false);
    const attendanceOptions = ['present', 'absent', 'leave'];
    const [workingDays, setWorkingDays] = useState([]);
    const currentDate = new Date();

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const data = await getAttendance(month, year);
            setAttendanceData(data.students);
        } catch (error) {
            console.error('Failed to fetch attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkingDays = async () => {
        try {
            const data = await getWorkingDays(month, year);
            setWorkingDays(data);
        } catch (error) {
            console.error('Failed to fetch working days:', error);
        }
    };

    useEffect(() => {
        fetchAttendance();
        fetchWorkingDays();
    }, [month, year]);

    const handleMarkAttendance = async (studentId, date, status) => {
        setMarkingLoading(true);
        try {
            await markAttendance(studentId, date, status);
    
            // Update the local state with the new attendance status
            setAttendanceData(prevData =>
                prevData.map(student =>
                    student.id === studentId
                        ? {
                            ...student,
                            attendance: student.attendance.some(att => new Date(att.date).toDateString() === new Date(date).toDateString())
                                ? student.attendance.map(att =>
                                    att.date === date ? { ...att, status } : att
                                  )
                                : [...student.attendance, { date, status }] // add new attendance entry if "Not Marked"
                        }
                        : student
                )
            );
    
            setEditingCell({ studentId: null, date: null });
        } catch (error) {
            console.error('Failed to mark attendance:', error);
        } finally {
            setMarkingLoading(false);
        }
    };
        const changeMonth = (direction) => {
        setMonth(prevMonth => {
            const newMonth = prevMonth + direction;
            if (newMonth < 1) {
                setYear(prevYear => prevYear - 1);
                return 12;
            } else if (newMonth > 12) {
                setYear(prevYear => prevYear + 1);
                return 1;
            }
            return newMonth;
        });
    };

    const isFutureDate = (dateString) => {
        const attendanceDate = new Date(dateString);
        return attendanceDate > currentDate;
    };

    return (
        <div className="flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Navbar />
                <main className="flex-1 p-8">
                    <h2 className="text-2xl font-semibold mb-4">Mark Attendance</h2>

                    <div className="flex items-center space-x-4 mb-6">
                        <button
                            onClick={() => changeMonth(-1)}
                            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition ease-in-out"
                            >
                            Previous
                        </button>
                        <span className="text-lg font-medium">
                            {new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                            onClick={() => changeMonth(1)}
                            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition ease-in-out"
                        >
                            Next
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-xl font-semibold text-red-500 mt-4">Loading attendance data...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            {attendanceData.length === 0 ? (
                                <p className="text-gray-500">No attendance data found.</p>
                            ) : (
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-2 px-4 border-b">Student Name</th>
                                            {workingDays.map((date) => (
                                                <th key={date} className="py-2 px-4 border-b">
                                                    {new Date(date).toLocaleString('en-US', { day: 'numeric', month: 'short' })}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceData.map((student) => (
                                            <tr key={student.id}>
                                                <td className="py-2 px-4 border-b ">{student.name}</td>
                                                {workingDays.map((date) => {
                                                    const attendance = student.attendance.find((att) => new Date(att.date).toDateString() === new Date(date).toDateString());
                                                    return (
                                                        <td key={date} className="py-2 px-4 border-b">
                                                            {editingCell.studentId === student.id && editingCell.date === date ? (
                                                                <select
                                                                value={attendance ? attendance.status : ''}
                                                                onChange={(e) => handleMarkAttendance(student.id, date, e.target.value)}
                                                                className="block min-w-[120px] p-2 border rounded-md bg-gray-100 text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
                                                                onBlur={() => setEditingCell({ studentId: null, date: null })}
                                                            >
                                                                <option value="" disabled>Select Status</option>
                                                                {attendanceOptions.map((option) => (
                                                                    <option key={option} value={option}>
                                                                        {option}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            
                                                            ) : (
                                                                <span
                                                                    className={`cursor-pointer ${
                                                                        isFutureDate(date) ? 'text-gray-400 cursor-no-drop' : attendance ? attendance.status === 'absent' ? 'text-red-500' : attendance.status === 'leave' ? 'text-yellow-500' : 'text-green-500' : 'text-gray-500'
                                                                    }`}
                                                                    onClick={() => {
                                                                        if (!isFutureDate(date)) {
                                                                            setEditingCell({ studentId: student.id, date });
                                                                        }
                                                                    }}
                                                                >
                                                                    {attendance ? attendance.status : 'Not Marked'}
                                                                </span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {markingLoading && <p className="text-xl font-semibold text-red-500 mt-4">Marking attendance, please wait...</p>}
                </main>
            </div>
        </div>
    );
};

export default MarkAttendance;
