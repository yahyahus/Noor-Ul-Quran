import React, { useState, useEffect } from 'react';
import { getAttendance, markAttendance } from '../services/teacherService';
import { getWorkingDays } from '../services/generalService';
import Header from '../Header';
import Navbar from '../Navbar';
import { 
    Calendar, 
    ChevronLeft, 
    ChevronRight, 
    Users, 
    Clock,
    LoaderCircle 
} from 'lucide-react';
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

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
            setAttendanceData(prevData =>
                prevData.map(student =>
                    student.id === studentId
                        ? {
                            ...student,
                            attendance: student.attendance.some(att => 
                                new Date(att.date).toDateString() === new Date(date).toDateString()
                            )
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

    const getStatusBadgeStyles = (status) => {
        const baseStyles = "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium transition-all";
        switch(status?.toLowerCase()) {
            case 'present':
                return cn(baseStyles, "bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400");
            case 'absent':
                return cn(baseStyles, "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400");
            case 'leave':
                return cn(baseStyles, "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400");
            default:
                return cn(baseStyles, "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="flex">
                <Navbar />
                <main className="flex-1 container mx-auto p-6">
                    <Card className="border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <CardHeader className="space-y-1 border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                                    <CardTitle className="text-2xl font-bold">Attendance Tracker</CardTitle>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => changeMonth(-1)}
                                        className="hover:bg-teal-100 hover:text-teal-900 dark:hover:bg-teal-900 dark:hover:text-teal-50"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-lg font-medium min-w-[200px] text-center">
                                        {new Date(year, month - 1).toLocaleString('en-US', { 
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => changeMonth(1)}
                                        className="hover:bg-teal-100 hover:text-teal-900 dark:hover:bg-teal-900 dark:hover:text-teal-50"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <LoaderCircle className="h-8 w-8 animate-spin text-teal-600 dark:text-teal-400" />
                                </div>
                            ) : attendanceData.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No students found for attendance marking.
                                </div>
                            ) : (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[200px]">
                                                    <div className="flex items-center space-x-2">
                                                        <Users className="h-4 w-4" />
                                                        <span>Student Name</span>
                                                    </div>
                                                </TableHead>
                                                {workingDays.map((date) => (
                                                    <TableHead key={date} className="text-center">
                                                        <div className="flex flex-col items-center justify-center space-y-1">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>
                                                                {new Date(date).toLocaleString('en-US', {
                                                                    day: 'numeric',
                                                                    month: 'short'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {attendanceData.map((student) => (
                                                <TableRow key={student.id}>
                                                    <TableCell className="font-medium">
                                                        {student.name}
                                                    </TableCell>
                                                    {workingDays.map((date) => {
                                                        const attendance = student.attendance.find(
                                                            (att) => new Date(att.date).toDateString() === new Date(date).toDateString()
                                                        );
                                                        const isEditing = editingCell.studentId === student.id && 
                                                                        editingCell.date === date;
                                                        const isFuture = isFutureDate(date);

                                                        return (
                                                            <TableCell key={date} className="text-center">
                                                                {isEditing ? (
                                                                    <Select
                                                                        value={attendance?.status || ""}
                                                                        onValueChange={(value) => handleMarkAttendance(student.id, date, value)}
                                                                    >
                                                                        <SelectTrigger className="w-32 mx-auto">
                                                                            <SelectValue placeholder="Select status" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {attendanceOptions.map((option) => (
                                                                                <SelectItem 
                                                                                    key={option} 
                                                                                    value={option}
                                                                                >
                                                                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                ) : (
                                                                    <button
                                                                        className={cn(
                                                                            getStatusBadgeStyles(attendance?.status),
                                                                            "hover:scale-105",
                                                                            {
                                                                                "cursor-not-allowed opacity-50": isFuture,
                                                                                "cursor-pointer": !isFuture
                                                                            }
                                                                        )}
                                                                        onClick={() => {
                                                                            if (!isFuture) {
                                                                                setEditingCell({ studentId: student.id, date });
                                                                            }
                                                                        }}
                                                                        disabled={isFuture}
                                                                    >
                                                                        {attendance?.status 
                                                                            ? attendance.status.charAt(0).toUpperCase() + 
                                                                              attendance.status.slice(1)
                                                                            : 'Not Marked'
                                                                        }
                                                                    </button>
                                                                )}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                            {markingLoading && (
                                <div className="flex items-center justify-center space-x-2 mt-4">
                                    <LoaderCircle className="h-4 w-4 animate-spin text-teal-600 dark:text-teal-400" />
                                    <span className="text-muted-foreground">
                                        Updating attendance...
                                    </span>
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