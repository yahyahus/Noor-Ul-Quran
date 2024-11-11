import React from 'react';
import Header from '../Header';
import Navbar from '../Navbar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import { Typography, Box } from '@mui/material';

// Sample data
const progressData = [
  { date: "2024-11-01", sabaqLines: 10, sabqi: true, manzil: true },
  { date: "2024-11-02", sabaqLines: 5, sabqi: true, manzil: false },
  // Add more data as needed
];

// Radial chart data for Hifz Progress
const radialData = [
  { name: 'Overall Hifz', value: 75, fill: '#38B2AC' },
  { name: 'Current Juz', value: 40, fill: '#81E6D9' },
];

const StudentDashboard = () => {
  const surahName = "Al-Baqarah";
  const juzNumber = 2;
  const weeklyGoal = 120; // Example weekly goal (e.g., memorize 30 lines of Quran)
  const linesCompleted = 50; // Example completed lines

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Navbar />
        <main className="flex-1 p-8 overflow-auto">
          <h1 className="text-3xl font-semibold mb-6 text-black">Student Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Current Surah and Juz Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs">
              <h2 className="text-lg font-bold text-black-600">Current Position</h2>
              <div className="mt-4">
                <p className="text-teal-600 font-semibold text-xl">{surahName}</p>
                <p className="text-teal-500 font-medium text-lg">Juz {juzNumber}</p>
              </div>
            </div>
            
            {/* Combined Hifz and Juz Completion Radial Chart */}
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
              <h2 className="text-lg font-bold text-black-600 mb-4">Hifz Progress</h2>
              <ResponsiveContainer width={300} height={300}>
                <RadialBarChart
                  innerRadius="30%"
                  outerRadius="100%"
                  barSize={20}
                  data={radialData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    minAngle={15}
                    background
                    clockWise
                    dataKey="value"
                  />
                  <Legend
                    iconSize={16}
                    layout="vertical"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginTop: '10px',
                      lineHeight: '1.8'
                    }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Goals Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs">
              <h2 className="text-lg font-bold text-black-600">Weekly Goals</h2>
              <div className="mt-4">
                <p className="text-teal-600 font-semibold text-xl">Goal: {weeklyGoal} Lines</p>
                <Box className="flex items-center mt-2">
                  <Box className="w-full bg-gray-300 h-2 rounded-full">
                    <Box className="bg-teal-500 h-2 rounded-full" style={{ width: `${(linesCompleted / weeklyGoal) * 100}%` }} />
                  </Box>
                </Box>
                <p className="text-teal-500 font-medium text-lg mt-2">Completed: {linesCompleted}/{weeklyGoal}</p>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mt-6">
            {/* Sabaq Line Chart and Sabqi/Manzil Progress */}
            <div className="bg-white p-6 rounded-lg shadow-lg col-span-1 md:col-span-2">
              <h2 className="text-xl font-bold text-black-600 mb-4">Sabaq Lines & Sabqi/Manzil Progress</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sabaqLines" fill="#4FD1C5" barSize={20} />
                  {/* Overlay custom indicators for Sabqi and Manzil */}
                  {progressData.map((entry, index) => (
                    <React.Fragment key={index}>
                      {entry.sabqi && (
                        <circle
                          cx={index * 30 + 15} // Position based on index, adjust as needed
                          cy={300 - entry.sabaqLines * 10 - 10} // Adjust y based on bar height
                          r={4}
                          fill="green"
                        />
                      )}
                      {entry.manzil && (
                        <circle
                          cx={index * 30 + 25} // Slightly offset for Manzil
                          cy={300 - entry.sabaqLines * 10 - 10}
                          r={4}
                          fill="blue"
                        />
                      )}
                    </React.Fragment>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
