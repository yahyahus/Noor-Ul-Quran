import React, { useState, useEffect } from 'react';
import { fetchAttendance } from '../services/studentservice';
import { getWorkingDays } from '../services/generalService';
import Header from '../Header';
import Navbar from '../Navbar';

const ViewAttendance = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [attendance, setAttendance] = useState([]);
    const [workingDays, setWorkingDays] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch attendance and working days when month or year changes
    useEffect(() => {
        const fetchAttendanceAndDays = async () => {
            setLoading(true);
            try {
                const attendanceData = await fetchAttendance(month, year);
                const workingDaysData = await getWorkingDays(month, year);

                // Map attendance data by date for quick lookup
                const attendanceMap = {};
                attendanceData.forEach(record => {
                    attendanceMap[new Date(record.date).toDateString()] = record.status;
                });

                // Format working days with attendance status or "Not Marked"
                const formattedWorkingDays = workingDaysData.map(date => {
                    const dateStr = new Date(date).toDateString();
                    return { date, status: attendanceMap[dateStr] || 'Not Marked' };
                });

                setAttendance(formattedWorkingDays);
                setWorkingDays(workingDaysData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceAndDays();
    }, [month, year]);

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

    return (
        <div className="flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Navbar />
                <main className="flex-1 p-8">
                    <h1 className="text-3xl font-semibold mb-4 text-gray-800">Attendance Record</h1>

                    <div className="flex items-center space-x-4 mb-6">
                        <button
                            onClick={() => changeMonth(-1)}
                            className="px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
                        >
                            Previous
                        </button>
                        <span className="text-lg font-medium">
                            {new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                            onClick={() => changeMonth(1)}
                            className="px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
                        >
                            Next
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-xl font-semibold text-red-500">Loading attendance data...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            {attendance.length === 0 ? (
                                <p className="text-gray-500">No attendance data found.</p>
                            ) : (
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-2 px-4 border-b">Date</th>
                                            <th className="py-2 px-4 border-b">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendance.map((record, index) => (
                                            <tr key={index}>
                                                <td className="py-2 px-4 border-b">
                                                    {new Date(record.date).toLocaleDateString('en-US', {
                                                        day: 'numeric', month: 'short'
                                                    })}
                                                </td>
                                                <td
                                                    className={`py-2 px-4 border-b ${
                                                        record.status === 'present' ? 'text-green-500' :
                                                        record.status === 'absent' ? 'text-red-500' :
                                                        record.status === 'leave' ? 'text-yellow-500' : 'text-gray-500'
                                                    }`}
                                                >
                                                    {record.status}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ViewAttendance;
