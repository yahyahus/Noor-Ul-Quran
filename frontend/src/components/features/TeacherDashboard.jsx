import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, Book, AlertCircle, Star, Edit2, BookOpen, RefreshCcw, Bookmark } from "lucide-react";
import Header from '../Header';
import Navbar from '../Navbar';

const teacherData = {
  name: "Ustaad Ahmed",
  totalStudents: 15,
  pendingSabaq: 2,
  topPerformer: {
    name: "Sarah Ahmad",
    sabaqLines: 20,
    sabqiCompleted: true,
    manzilRating: 4.5
  }
};

const studentProgress = [
  { 
    name: "Sarah Ahmad",
    sabaq: { current: 20, target: "Verse 15-20, Page 255" },
    sabqi: 4.5,
    manzil: { juzz: 5, rating: 4.5 }
  },
  { 
    name: "Usman Ali",
    sabaq: { current: 15, target: "Verse 10-15, Page 242" },
    sabqi: 4.0,
    manzil: { juzz: 3, rating: 4.0 }
  },
  { 
    name: "Fatima Khan",
    sabaq: { current: 18, target: "Verse 20-25, Page 260" },
    sabqi: 4.8,
    manzil: { juzz: 4, rating: 4.2 }
  }
];

const TeacherDashboard = () => {
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
                  <CardTitle className="text-xl">Welcome back, {teacherData.name}</CardTitle>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Total Students</p>
                        <p className="text-lg font-semibold">{teacherData.totalStudents} Students</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Book className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Pending Sabaq</p>
                        <p className="text-lg font-semibold">{teacherData.pendingSabaq} Students</p>
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
                  <h3 className="font-semibold text-gray-900">{teacherData.topPerformer.name}</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="text-teal-600">Sabaq: {teacherData.topPerformer.sabaqLines} lines</p>
                    <p className="text-teal-600">
                      Sabqi: {teacherData.topPerformer.sabqiCompleted ? "Completed" : "Pending"}
                    </p>
                    <p className="text-teal-600">
                      Manzil Rating: {teacherData.topPerformer.manzilRating}/5
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
                    {studentProgress.map((student, index) => (
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
                    ))}
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