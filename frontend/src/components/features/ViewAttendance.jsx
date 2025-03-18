import React, { useState, useEffect } from 'react';
import { fetchAttendance } from '../services/studentservice';
import { getWorkingDays } from '../services/generalService';
import Header from '../Header';
import Navbar from '../Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const ViewAttendance = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [attendance, setAttendance] = useState([]);
    const [workingDays, setWorkingDays] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAttendanceAndDays = async () => {
            setLoading(true);
            try {
                const attendanceData = await fetchAttendance(month, year);
                const workingDaysData = await getWorkingDays(month, year);

                const attendanceMap = {};
                attendanceData.forEach(record => {
                    attendanceMap[new Date(record.date).toDateString()] = record.status;
                });

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

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'present':
                return 'text-teal-600 dark:text-teal-400';
            case 'absent':
                return 'text-red-600 dark:text-red-400';
            case 'leave':
                return 'text-yellow-600 dark:text-yellow-400';
            default:
                return 'text-muted-foreground';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="flex">
                <Navbar />
                <main className="flex-1 container mx-auto p-6">
                    <Card className="border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <CardHeader className="space-y-1">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl font-bold">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                                        <h2 className="text-2xl font-semibold text-teal-700 dark:text-teal-500">
                                            Attendance Record
                                        </h2>
                                    </div>
                                </CardTitle>
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
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <LoaderCircle className="h-8 w-8 animate-spin text-teal-600 dark:text-teal-400" />
                                </div>
                            ) : attendance.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No attendance data found for this period.
                                </div>
                            ) : (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[200px]">Date</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {attendance.map((record, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">
                                                        {new Date(record.date).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            day: 'numeric',
                                                            month: 'short'
                                                        })}
                                                    </TableCell>
                                                    <TableCell className={cn(
                                                        "font-medium",
                                                        getStatusColor(record.status)
                                                    )}>
                                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default ViewAttendance;