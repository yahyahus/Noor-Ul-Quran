import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Book, RefreshCcw, Bookmark, MessageSquare } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '../Header';
import Navbar from '../Navbar';

// Mock data for the past week
const mockData = {
  sabaq: [
    { day: 'Mon', lines: 12 },
    { day: 'Tue', lines: 15 },
    { day: 'Wed', lines: 10 },
    { day: 'Thu', lines: 16 },
    { day: 'Fri', lines: 14 },
    { day: 'Sat', lines: 13 },
    { day: 'Sun', lines: 15 }
  ],
  manzil: [
    { day: 'Mon', quality: 4.5 },
    { day: 'Tue', quality: 4.0 },
    { day: 'Wed', quality: 3.5 },
    { day: 'Thu', quality: 4.2 },
    { day: 'Fri', quality: 4.8 },
    { day: 'Sat', quality: 4.0 },
    { day: 'Sun', quality: 4.2 }
  ]
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-teal-600">
          {payload[0].name === "lines" 
            ? `${payload[0].value} lines`
            : `Quality: ${payload[0].value}/5`}
        </p>
      </div>
    );
  }
  return null;
};

const StudentDashboard = () => {
  const [showManzil, setShowManzil] = useState(false);

  // Calculate average lines per day
  const avgLines = (mockData.sabaq.reduce((acc, curr) => acc + curr.lines, 0) / 7).toFixed(1);
  const avgManzilQuality = (mockData.manzil.reduce((acc, curr) => acc + curr.quality, 0) / 7).toFixed(1);

  const todayProgress = {
    sabaq: '16 lines',
    sabqi: 'Juzz 10',
    manzil: 'Juzz 5',
    remarks: 'Satisfied with sabaq, sabqi. Needs improvement in manzil'
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Navbar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Dashboard Header */}
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
              <div className="text-sm text-gray-600">
                <p>This week, you memorized an average of {avgLines} lines per day.</p>
                <p>Your manzil overall quality for this week was {avgManzilQuality}/5</p>
              </div>
            </div>

            {/* Current Juzz */}
            <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
              <CardHeader>
                <CardTitle className="text-xl">Juzz 10 (Wa'alamuu)</CardTitle>
              </CardHeader>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Today's Progress */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Book className="h-5 w-5 text-teal-500" />
                    Today's Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="p-3 bg-teal-100 rounded-full">
                        <Book className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">Sabaq</p>
                        <p className="text-lg font-semibold text-teal-600">{todayProgress.sabaq}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="p-3 bg-teal-100 rounded-full">
                        <RefreshCcw className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">Sabqi</p>
                        <p className="text-lg font-semibold text-teal-600">{todayProgress.sabqi}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="p-3 bg-teal-100 rounded-full">
                        <Bookmark className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">Manzil</p>
                        <p className="text-lg font-semibold text-teal-600">{todayProgress.manzil}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="p-3 bg-teal-100 rounded-full">
                        <MessageSquare className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">Remarks</p>
                        <p className="text-sm text-gray-600">{todayProgress.remarks}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Chart */}
              <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    {showManzil ? (
                      <>
                        <Bookmark className="h-5 w-5 text-teal-500" />
                        Manzil Quality
                      </>
                    ) : (
                      <>
                        <Book className="h-5 w-5 text-teal-500" />
                        Sabaq Progress
                      </>
                    )}
                  </CardTitle>
                  <button
                    onClick={() => setShowManzil(!showManzil)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    {showManzil ? <ArrowLeft className="h-5 w-5 text-gray-600" /> : <ArrowRight className="h-5 w-5 text-gray-600" />}
                  </button>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={showManzil ? mockData.manzil : mockData.sabaq}
                        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                      >
                        <XAxis 
                          dataKey="day" 
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          domain={showManzil ? [0, 5] : [0, 'auto']}
                          ticks={showManzil ? [1, 2, 3, 4, 5] : undefined}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey={showManzil ? "quality" : "lines"}
                          fill="rgba(20, 184, 166, 0.7)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;