import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Book, RefreshCcw, Bookmark, MessageSquare } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '../Header';
import Navbar from '../Navbar';
import { getTodayProgress, getWeeklyProgress, getCurrentJuzzInfo } from '../services/studentservice';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for different data types
  const [todayProgress, setTodayProgress] = useState(null);
  const [weeklyProgress, setWeeklyProgress] = useState(null);
  const [currentJuzz, setCurrentJuzz] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [todayData, weeklyData, juzzData] = await Promise.all([
          getTodayProgress(),
          getWeeklyProgress(),
          getCurrentJuzzInfo()
        ]);

        setTodayProgress(todayData);
        setWeeklyProgress(weeklyData);
        setCurrentJuzz(juzzData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
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
        <div className="flex flex-1">
          <Navbar />
          <main className="flex-1 p-4 bg-gray-50 flex items-center justify-center">
            <p className="text-gray-600">Loading dashboard data...</p>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1">
          <Navbar />
          <main className="flex-1 p-4 bg-gray-50 flex items-center justify-center">
            <p className="text-red-600">{error}</p>
          </main>
        </div>
      </div>
    );
  }

  // Calculate averages from weekly progress
  const avgLines = weeklyProgress?.summary?.averageLines || 0;
  const avgManzilQuality = weeklyProgress?.summary?.averageManzilQuality || 0;

  const formattedTodayProgress = {
    sabaq: `${todayProgress?.sabaq?.lines || 0} lines`,
    sabqi: todayProgress?.sabqi?.juzz ? `Juzz ${todayProgress.sabqi.juzz.number}` : 'Not recorded',
    manzil: todayProgress?.manzil?.juzz ? `Juzz ${todayProgress.manzil.juzz.number}` : 'Not recorded',
    remarks: todayProgress?.sabaq?.remarks || 'No remarks for today'
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 p-4 bg-gray-50">
          <div className="h-full space-y-4">
            {/* Dashboard Header */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
              <div className="text-sm text-gray-600">
                <p>This week, you memorized an average of {avgLines} lines per day.</p>
                <p>Your manzil overall quality for this week was {avgManzilQuality}/5</p>
              </div>
            </div>

            {/* Current Juzz */}
            <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
              <CardHeader className="py-2">
                <CardTitle className="text-lg">
                  Juzz {currentJuzz?.currentJuzz?.number} ({currentJuzz?.currentJuzz?.name})
                </CardTitle>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-5 gap-4 h-96">
              {/* Today's Progress Card */}
              <Card className="col-span-3 shadow-sm">
                <CardHeader className="py-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Book className="h-4 w-4 text-teal-500" />
                    Today's Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* Sabaq */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="p-2 bg-teal-100 rounded-full">
                        <Book className="h-4 w-4 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">Sabaq</p>
                        <p className="text-base font-semibold text-teal-600">{formattedTodayProgress.sabaq}</p>
                      </div>
                    </div>
                    
                    {/* Sabqi */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="p-2 bg-teal-100 rounded-full">
                        <RefreshCcw className="h-4 w-4 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">Sabqi</p>
                        <p className="text-base font-semibold text-teal-600">{formattedTodayProgress.sabqi}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* Manzil */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="p-2 bg-teal-100 rounded-full">
                        <Bookmark className="h-4 w-4 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">Manzil</p>
                        <p className="text-base font-semibold text-teal-600">{formattedTodayProgress.manzil}</p>
                      </div>
                    </div>

                    {/* Remarks */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="p-2 bg-teal-100 rounded-full">
                        <MessageSquare className="h-4 w-4 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">Remarks</p>
                        <p className="text-sm text-gray-600">{formattedTodayProgress.remarks}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional remarks section */}
                  <div className="mt-3 p-3 bg-teal-50 rounded-lg border border-teal-100">
                    <p className="text-sm text-teal-700 font-medium">Daily Summary</p>
                    <p className="text-sm text-teal-600 mt-1">
                      {todayProgress?.sabaq?.completed ? 'Completed today\'s tasks. ' : 'Tasks in progress. '}
                      Continue maintaining consistency in daily revisions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Chart Card */}
              <Card className="col-span-2 shadow-sm relative">
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      {showManzil ? (
                        <>
                          <Bookmark className="h-4 w-4 text-teal-500" />
                          Manzil Quality
                        </>
                      ) : (
                        <>
                          <Book className="h-4 w-4 text-teal-500" />
                          Sabaq Progress
                        </>
                      )}
                    </CardTitle>
                    <button
                      onClick={() => setShowManzil(!showManzil)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 transition-colors rounded-full text-teal-600 text-sm font-medium"
                    >
                      {showManzil ? (
                        <>
                          <ArrowLeft className="h-4 w-4" />
                          <span>View Sabaq</span>
                        </>
                      ) : (
                        <>
                          <span>View Manzil</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={weeklyProgress?.dailyProgress}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgb(13, 148, 136)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="rgb(20, 184, 166)" stopOpacity={0.4}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="day" 
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis 
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          domain={showManzil ? [0, 5] : [0, 'auto']}
                          ticks={showManzil ? [1, 2, 3, 4, 5] : undefined}
                          dx={-10}
                        />
                        <Tooltip 
                          content={<CustomTooltip />}
                          cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                        />
                        <Bar
                          dataKey={showManzil ? "manzil.quality" : "sabaq.lines"}
                          fill="url(#barGradient)"
                          radius={[6, 6, 0, 0]}
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