import React from 'react';
import Header from '../Header';
import Navbar from '../Navbar';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { People, DateRange, DoneAll, CheckCircle, Cancel } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data
const totalRegisteredStudents = 45;
const studentsProgressData = [
  { name: "Abu Hamza", attendance: 90, sabaqLines: 32, sabqi: true, manzil: false },
  { name: "Yasir Idris", attendance: 85, sabaqLines: 20, sabqi: false, manzil: true },
  { name: "Muhammad Ahmed", attendance: 95, sabaqLines: 26, sabqi: true, manzil: true },
  { name: "Abdul Aziz", attendance: 80, sabaqLines: 40, sabqi: true, manzil: false },
  { name: "Hassan Zahid", attendance: 70, sabaqLines: 34, sabqi: false, manzil: true },
  // More student data
];

const TeacherDashboard = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Navbar />
        <main className="flex-1 p-8 overflow-auto">
          <h1 className="text-3xl font-semibold mb-6 text-black">Teacher Dashboard</h1>

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Registered Students Card */}
            <Card className="shadow-lg hover:scale-105 transform transition-all duration-300 rounded-3xl">
              <CardContent className="flex items-center">
                <Box className="flex items-center justify-center w-14 h-14 rounded-full bg-teal-500 text-white mr-4">
                  <People />
                </Box>
                <div>
                  <Typography variant="subtitle1" color="textSecondary">
                    Total Registered Students
                  </Typography>
                  <Typography variant="h4" className="font-extrabold text-teal-600">
                    {totalRegisteredStudents}
                  </Typography>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Classes Card */}
            <Card className="shadow-lg hover:scale-105 transform transition-all duration-300 rounded-3xl">
              <CardContent className="flex items-center">
                <Box className="flex items-center justify-center w-14 h-14 rounded-full bg-teal-500 text-white mr-4">
                  <DateRange />
                </Box>
                <div>
                  <Typography variant="subtitle1" color="textSecondary">
                    Assigned Classes
                  </Typography>
                  <Typography variant="h5" className="font-bold text-teal-600">
                    Fall-2024
                  </Typography>
                  <Typography variant="h6" className="font-medium text-teal-500">
                    Spring-2025
                  </Typography>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Test Card */}
            <Card className="shadow-lg hover:scale-105 transform transition-all duration-300 rounded-3xl">
              <CardContent className="flex items-center">
                <Box className="flex items-center justify-center w-14 h-14 rounded-full bg-teal-500 text-white mr-4">
                  <DoneAll />
                </Box>
                <div>
                  <Typography variant="subtitle1" color="textSecondary">
                    Weekly Test
                  </Typography>
                  <Typography variant="h5" className="font-bold text-teal-600">
                    Friday
                  </Typography>
                  <Typography variant="h6" className="font-medium text-teal-500">
                    Juzz 1-4
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Overview Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg col-span-1 md:col-span-3">
            <h2 className="text-xl font-bold text-black-600 mb-4">Students' Attendance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentsProgressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendance" fill="#4FD1C5" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Student Progress Table */}
          <div className="bg-white p-6 rounded-lg shadow-lg col-span-1 md:col-span-3">
            <h2 className="text-xl font-bold text-black-600 mb-4">Students' Progress Today</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 text-center">Name</th>
                  <th className="py-2 text-center">Sabaq Lines</th>
                  <th className="py-2 text-center">Sabqi</th>
                  <th className="py-2 text-center">Manzil</th>
                </tr>
              </thead>
              <tbody>
                {studentsProgressData.map((student, index) => (
                  <tr key={index} className="text-center">
                    <td className="py-2">{student.name}</td>
                    <td className="py-2">{student.sabaqLines}</td>
                    <td className="py-2">
                      {student.sabqi ? (
                        <CheckCircle style={{ color: '#4CAF50' }} /> // Green tick for completed
                      ) : (
                        <Cancel style={{ color: '#F44336' }} /> // Red cross for not completed
                      )}
                    </td>
                    <td className="py-2">
                      {student.manzil ? (
                        <CheckCircle style={{ color: '#4CAF50' }} />
                      ) : (
                        <Cancel style={{ color: '#F44336' }} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
