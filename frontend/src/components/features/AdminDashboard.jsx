import React from 'react';
import Header from '../Header';
import Navbar from '../Navbar';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { People, DoneAll, DateRange } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const primaryColor = '#26a69a'; // teal
  const secondaryColor = '#42a5f5'; // blue
  const accentColor = '#FF7043'; // deep orange for icons

  // Sample data for the line chart (Monthly completions)
  const data = [
    { name: 'Jan', completions: 15 },
    { name: 'Feb', completions: 20 },
    { name: 'Mar', completions: 12 },
    { name: 'Apr', completions: 25 },
    { name: 'May', completions: 18 },
    { name: 'Jun', completions: 30 },
    { name: 'Jul', completions: 22 },
    { name: 'Aug', completions: 27 },
    { name: 'Sep', completions: 15 },
    { name: 'Oct', completions: 24 },
    { name: 'Nov', completions: 32 },
    { name: 'Dec', completions: 28 },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Navbar />
        <main className="flex-1 p-8 bg-gray-50 overflow-auto">
          <h1 className="text-3xl font-semibold mb-4 text-gray-800">Admin Dashboard</h1>

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* No. of Present Students Today Card */}
            <Card className="shadow-lg hover:scale-105 transform transition-all duration-300 rounded-3xl">
              <CardContent className="flex items-center">
                <Box 
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-teal-500 text-white mr-4"
                >
                  <People />
                </Box>
                <div>
                  <Typography variant="subtitle1" color="textSecondary">
                    Present Students Today
                  </Typography>
                  <Typography variant="h4" className="font-extrabold text-teal-600">
                    95
                  </Typography>
                </div>
              </CardContent>
            </Card>

            {/* % of Students Who Completed Their Sabaq Card */}
            <Card className="shadow-lg hover:scale-105 transform transition-all duration-300 rounded-3xl">
              <CardContent className="flex items-center">
                <Box 
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-teal-500 text-white mr-4"
                >
                  <DoneAll />
                </Box>
                <div>
                  <Typography variant="subtitle1" color="textSecondary">
                    Sabaq Completion Rate
                  </Typography>
                  <Typography variant="h4" className="font-extrabold text-teal-600">
                    85%
                  </Typography>
                </div>
              </CardContent>
            </Card>

            {/* No. of Students Completing a Juz This Month Card */}
            <Card className="shadow-lg hover:scale-105 transform transition-all duration-300 rounded-3xl">
              <CardContent className="flex items-center">
                <Box 
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-teal-500 text-white mr-4"
                >
                  <DateRange />
                </Box>
                <div>
                  <Typography variant="subtitle1" color="textSecondary">
                    Juz Completions This Month
                  </Typography>
                  <Typography variant="h4" className="font-extrabold text-teal-600">
                    12
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Card */}
          <Card className="shadow-lg rounded-3xl p-4 mt-6">
            <CardContent>
              <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                Juzz Completions By Month
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="completions" stroke={primaryColor} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
