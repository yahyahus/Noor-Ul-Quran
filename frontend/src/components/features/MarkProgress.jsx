import React, { useState, useEffect } from 'react';
import { getProgress, markSabaq, markSabqi, markManzil } from '../services/teacherService';
import { getWorkingDays } from '../services/generalService';
import Header from '../Header';
import Navbar from '../Navbar';

const MarkProgress = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [progressData, setProgressData] = useState([]);
    const [editingCell, setEditingCell] = useState({ studentId: null, date: null });
    const [loading, setLoading] = useState(false);
    const [markingLoading, setMarkingLoading] = useState(false);
    const [workingDays, setWorkingDays] = useState([]);
    const currentDate = new Date();

    const fetchProgress = async () => {
        setLoading(true);
        try {
            const data = await getProgress(month, year);
            setProgressData(data.students);
        } catch (error) {
            console.error('Failed to fetch progress:', error);
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
        fetchProgress();
        fetchWorkingDays();
    }, [month, year]);

    const handleMarkProgress = async (studentId, date, type) => {
        setMarkingLoading(true);
        // Create a backup of the current progress data before making the request
        const originalProgressData = [...progressData];
    
        try {
            let response;
            if (type === 'sabaq') {
                response = await markSabaq(studentId, date);
            } else if (type === 'sabqi') {
                response = await markSabqi(studentId, date);
            } else if (type === 'manzil') {
                response = await markManzil(studentId, date);
            }
    
            // Assuming the response is a success if it's truthy
            if (response) {
                // Optimistically update the state
                setProgressData(prevData =>
                    prevData.map(student =>
                        student.id === studentId
                            ? {
                                ...student,
                                progress: student.progress.some(p => new Date(p.date).toDateString() === new Date(date).toDateString())
                                    ? student.progress.map(p =>
                                        p.date === date ? { ...p, [type]: !p[type] } : p
                                    )
                                    : [...student.progress, { date, [type]: true }] // Set to true on initial marking
                            }
                            : student
                    )
                );
            }
    
            // Clear editing state
            setEditingCell({ studentId: null, date: null });
        } catch (error) {
            console.error('Failed to mark progress:', error);
            // Restore the original progress data in case of failure
            setProgressData(originalProgressData);
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
        const progressDate = new Date(dateString);
        return progressDate > currentDate;
    };

    const renderProgressIcon = (progress, type) => {
        if (progress && progress[type] !== undefined) {
            return progress[type] ? '✅' : '❌'; // Using checkmark and cross icons
        }
        return '—'; // Dash for no data
    };

    return (
        <div className="flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Navbar />
                <main className="flex-1 p-8">
                    <h2 className="text-2xl font-semibold mb-4">Mark Progress</h2>

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
                        <p className="text-xl font-semibold text-red-500 mt-4">Loading progress data...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            {progressData.length === 0 ? (
                                <p className="text-gray-500">No progress data found.</p>
                            ) : (
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-2 px-4 border-b">Student Name</th>
                                            <th className="py-2 px-4 border-b">Type</th> {/* New column for Type */}
                                            {workingDays.map((date) => (
                                                <th key={date} className="py-2 px-4 border-b">
                                                    {new Date(date).toLocaleString('en-US', { day: 'numeric', month: 'short' })}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {progressData.map((student) => (
                                            <tr key={student.id}>
                                                <td className="py-2 px-4 border-b">{student.name}</td>
                                                <td className="py-2 px-4 border-b">
                                                    <div>Sabaq</div>
                                                    <div>Sabqi</div>
                                                    <div>Manzil</div>
                                                </td> {/* Displaying Types */}
                                                {workingDays.map((date) => {
                                                    const progress = student.progress.find((p) => new Date(p.date).toDateString() === new Date(date).toDateString());
                                                    return (
                                                        <td key={date} className="py-2 px-4 border-b">
                                                            {editingCell.studentId === student.id && editingCell.date === date ? (
                                                                <div className="flex space-x-2">
                                                                    <button
                                                                        onClick={() => handleMarkProgress(student.id, date, 'sabaq')}
                                                                        className="px-2 py-1 bg-green-500 text-white rounded"
                                                                    >
                                                                        Mark Sabaq
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleMarkProgress(student.id, date, 'sabqi')}
                                                                        className="px-2 py-1 bg-blue-500 text-white rounded"
                                                                    >
                                                                        Mark Sabqi
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleMarkProgress(student.id, date, 'manzil')}
                                                                        className="px-2 py-1 bg-yellow-500 text-white rounded"
                                                                    >
                                                                        Mark Manzil
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className={`text-xl ${isFutureDate(date) ? 'text-gray-400 cursor-no-drop' : 'cursor-pointer'}`}
                                                                    onClick={() => {
                                                                        if (!isFutureDate(date)) {
                                                                            setEditingCell({ studentId: student.id, date });
                                                                        }
                                                                    }}
                                                                >
                                                                    <div>{renderProgressIcon(progress, 'sabaq')}</div>
                                                                    <div>{renderProgressIcon(progress, 'sabqi')}</div>
                                                                    <div>{renderProgressIcon(progress, 'manzil')}</div>
                                                                </div>
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

                    {markingLoading && <p className="text-xl font-semibold text-red-500 mt-4">Marking progress, please wait...</p>}
                </main>
            </div>
        </div>
    );
};

export default MarkProgress;
