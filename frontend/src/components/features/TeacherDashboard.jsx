import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, Book, AlertCircle, Star, Edit2, BookOpen, RefreshCcw, Bookmark } from "lucide-react";
import Header from '../Header';
import Navbar from '../Navbar';
import { getDashboardStats, getTodayStudentProgress } from '../services/teacherService';

const TeacherDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    name: "",
    totalStudents: 0,
    pendingSabaq: 0,
    topPerformer: {
      name: "",
      sabaqLines: 0,
      sabqiCompleted: false,
      manzilRating: 0
    }
  });

  const [studentProgress, setStudentProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch dashboard stats and today's student progress in parallel
        const [statsData, progressData] = await Promise.all([
          getDashboardStats(),
          getTodayStudentProgress()
        ]);

        setDashboardStats(statsData);
        setStudentProgress(progressData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 p-4 bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500">Loading dashboard data...</p>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 p-4 bg-gray-50 flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 p-4 bg-gray-50">
          <div className="h-full space-y-4">
            {/* Overview Section */}
            <div className="grid grid-cols-4 gap-4">
              {/* Welcome & Stats Cards - Takes up 3 columns */}
              <Card className="col-span-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Welcome back, {dashboardStats.name}</CardTitle>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Total Students</p>
                        <p className="text-lg font-semibold">{dashboardStats.totalStudents} Students</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Book className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Pending Sabaq</p>
                        <p className="text-lg font-semibold">{dashboardStats.pendingSabaq} Students</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Quick Action</p>
                        <p className="text-sm font-medium">Review pending sabaq</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Top Performer Card - Takes up 1 column */}
              <Card className="bg-teal-50 border-teal-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-teal-600 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Top Performer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-gray-900">{dashboardStats.topPerformer.name}</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="text-teal-600">Sabaq: {dashboardStats.topPerformer.sabaqLines} lines</p>
                    <p className="text-teal-600">
                      Sabqi: {dashboardStats.topPerformer.sabqiCompleted ? "Completed" : "Pending"}
                    </p>
                    <p className="text-teal-600">
                      Manzil Rating: {dashboardStats.topPerformer.manzilRating}/5
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Student Progress Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Today's Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-teal-500" />
                          Sabaq
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <RefreshCcw className="h-4 w-4 text-teal-500" />
                          Sabqi
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <Bookmark className="h-4 w-4 text-teal-500" />
                          Manzil
                        </div>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentProgress.length > 0 ? (
                      studentProgress.map((student, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>
                            <div>
                              <span className="font-medium">{student.sabaq.current} lines</span>
                              <p className="text-sm text-gray-500">{student.sabaq.target}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(student.sabqi)
                                      ? "text-teal-500"
                                      : "text-gray-300"
                                  }`}
                                  fill={i < Math.floor(student.sabqi) ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>Juzz {student.manzil.juzz}</p>
                              <div className="flex items-center mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < Math.floor(student.manzil.rating)
                                        ? "text-teal-500"
                                        : "text-gray-300"
                                    }`}
                                    fill={i < Math.floor(student.manzil.rating) ? "currentColor" : "none"}
                                  />
                                ))}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-teal-600 border-teal-200 hover:bg-teal-50"
                            >
                              <Edit2 className="h-4 w-4 mr-1" />
                              Edit Target
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                          No progress data available for today
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;