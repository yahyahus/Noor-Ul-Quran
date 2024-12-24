import React, { useState, useEffect } from 'react';
import { getAttendance, markAttendance } from '../services/teacherService';
import { getWorkingDays } from '../services/generalService';
import Header from '../Header';
import Navbar from '../Navbar';
import { Calendar, ChevronLeft, ChevronRight, Users, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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

    // Keep your existing fetch functions
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

    // Keep your existing handlers
    const handleMarkAttendance = async (studentId, date, status) => {
        setMarkingLoading(true);
        try {
            await markAttendance(studentId, date, status);
            setAttendanceData(prevData =>
                prevData.map(student =>
                    student.id === studentId
                        ? {
                            ...student,
                            attendance: student.attendance.some(att => new Date(att.date).toDateString() === new Date(date).toDateString())
                                ? student.attendance.map(att =>
                                    att.date === date ? { ...att, status } : att
                                )
                                : [...student.attendance, { date, status }]
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

    const getStatusColor = (status) => {
        switch(status) {
            case 'present':
                return 'bg-teal-100 text-teal-700 ring-2 ring-teal-500/20';
            case 'absent':
                return 'bg-red-100 text-red-700 ring-2 ring-red-500/20';
            case 'leave':
                return 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500/20';
            default:
                return 'bg-gray-100 text-gray-700 ring-2 ring-gray-500/20';
        }
    };

    return (
        <div className="flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Navbar />
                <main className="flex-1 p-8">
                    <Card className="w-full bg-gradient-to-br from-teal-50 to-white">
                        <CardHeader className="border-b border-teal-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-6 w-6 text-teal-500" />
                                    <CardTitle className="text-teal-900">Attendance Tracker</CardTitle>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => changeMonth(-1)}
                                        className="flex items-center gap-2 rounded-full bg-teal-500 px-4 py-2 text-white hover:bg-teal-600 transition-colors"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </button>
                                    <span className="text-lg font-medium text-teal-900">
                                        {new Date(year, month - 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <button
                                        onClick={() => changeMonth(1)}
                                        className="flex items-center gap-2 rounded-full bg-teal-500 px-4 py-2 text-white hover:bg-teal-600 transition-colors"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {loading ? (
                                <div className="flex items-center justify-center p-8">
                                    <p className="text-teal-600 font-medium">Loading attendance data...</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-lg border border-teal-100 bg-white shadow-sm">
                                    {attendanceData.length === 0 ? (
                                        <p className="p-8 text-center text-gray-500">No attendance data found.</p>
                                    ) : (
                                        <table className="w-full border-collapse text-sm">
                                            <thead>
                                                <tr className="bg-teal-500 text-white">
                                                    <th className="w-48 px-4 py-3 text-left font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-5 w-5" />
                                                            <span>Student Name</span>
                                                        </div>
                                                    </th>
                                                    {workingDays.map((date) => (
                                                        <th key={date} className="px-4 py-3 text-center font-medium">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>
                                                                    {new Date(date).toLocaleString('en-US', { 
                                                                        day: 'numeric',
                                                                        month: 'short'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {attendanceData.map((student, idx) => (
                                                    <tr 
                                                        key={student.id}
                                                        className={`border-b border-teal-100 transition-colors hover:bg-teal-50
                                                            ${idx % 2 === 0 ? 'bg-white' : 'bg-teal-50/50'}`}
                                                    >
                                                        <td className="px-4 py-3 font-medium text-teal-900">
                                                            {student.name}
                                                        </td>
                                                        {workingDays.map((date) => {
                                                            const attendance = student.attendance.find(
                                                                (att) => new Date(att.date).toDateString() === new Date(date).toDateString()
                                                            );
                                                            return (
                                                                <td key={date} className="px-4 py-3 text-center">
                                                                    {editingCell.studentId === student.id && 
                                                                     editingCell.date === date ? (
                                                                        <select
                                                                            value={attendance ? attendance.status : ''}
                                                                            onChange={(e) => handleMarkAttendance(student.id, date, e.target.value)}
                                                                            className="block w-full rounded-md border border-teal-200 bg-white p-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
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
                                                                            className={`inline-flex cursor-pointer items-center justify-center rounded-full px-3 py-1 text-xs font-medium transition-all hover:scale-105 ${
                                                                                isFutureDate(date) 
                                                                                    ? 'cursor-no-drop bg-gray-100 text-gray-400' 
                                                                                    : getStatusColor(attendance?.status)
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
                            {markingLoading && (
                                <div className="mt-4 text-center">
                                    <p className="text-teal-600 font-medium">Marking attendance, please wait...</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default MarkAttendance;