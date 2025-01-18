import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, BookOpen, Book, BookMarked, ChevronDown, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import {getProgress} from "../services/studentservice";
import Header from "../Header";
import Navbar from "../Navbar";

const StatusBadge = ({ completed }) => (
  <Badge
    variant="outline" 
    className={`text-xs ${
      completed 
        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-50' 
        : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-50'
    }`}
  >
    {completed ? "Complete" : "Incomplete"}
  </Badge>
);

const DetailBox = ({ title, value, icon: Icon }) => (
  <div className="flex items-center gap-2 text-gray-600">
    <Icon className="h-4 w-4" />
    <span className="text-sm font-medium">{title}:</span>
    <span className="text-sm">{value}</span>
  </div>
);

const ProgressSection = ({ title, icon: Icon, data, isExpanded }) => {
  if (!data) return null;

  return (
    <div className={`h-full ${isExpanded ? 'bg-gray-50 dark:bg-gray-800 rounded-lg p-4' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-teal-600" />
          <span className="font-medium text-gray-700 dark:text-gray-200">{title}</span>
        </div>
        <StatusBadge completed={data.completed} />
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        {title === "Sabaq" && (
          <span className="font-medium">{data.numberOfLines || 0} lines</span>
        )}
        {(title === "Sabqi" || title === "Manzil") && (
          <span className="font-medium">Quality: {data.quality || 0}/5</span>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-4 mt-4">
          {title === "Sabaq" && (
            <>
              <DetailBox 
                title="Range" 
                value={data.remarks || 'No remarks'}
                icon={ArrowRight} 
              />
            </>
          )}

          {(title === "Sabqi" || title === "Manzil") && (
            <DetailBox 
              title="Status" 
              value={data.remarks || 'No remarks'}
              icon={ArrowRight}
            />
          )}
        </div>
      )}
    </div>
  );
};

const DailyCard = ({ date, progressData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!progressData) {
    return (
      <Card className="border-l-4 border-l-gray-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            {format(date, 'EEEE, MMM d')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No progress recorded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-l-4 border-l-teal-500 transition-all duration-300 ${
      isExpanded ? 'col-span-full' : ''
    }`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-teal-600" />
            {format(date, 'EEEE, MMM d')}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isExpanded ? 'transform rotate-180' : ''
            }`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={`grid ${
          isExpanded 
            ? 'grid-cols-3 gap-4' 
            : 'grid-cols-1 gap-4'
        }`}>
          <ProgressSection
            title="Sabaq"
            icon={BookOpen}
            data={progressData.sabaq}
            isExpanded={isExpanded}
          />
          <ProgressSection
            title="Sabqi"
            icon={Book}
            data={progressData.sabqi}
            isExpanded={isExpanded}
          />
          <ProgressSection
            title="Manzil"
            icon={BookMarked}
            data={progressData.manzil}
            isExpanded={isExpanded}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const ViewProgress = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekData, setWeekData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchWeekData = async (date) => {
    setLoading(true);
    const weekStart = startOfWeek(date);
    const weekEnd = endOfWeek(date);
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const newWeekData = {};
    
    try {
      await Promise.all(
        daysInWeek.map(async (day) => {
          const formattedDate = format(day, 'yyyy-MM-dd');
          try {
            const response = await getProgress(formattedDate);
            if (response.message === "Progress retrieved successfully.") {
              newWeekData[formattedDate] = {
                sabaq: response.sabaq,
                sabqi: response.sabqi,
                manzil: response.manzil,
                studentName: response.studentName,
                teacherName: response.teacherName
              };
            }
          } catch (error) {
            console.error(`Error fetching data for ${formattedDate}:`, error);
          }
        })
      );
      
      setWeekData(newWeekData);
    } catch (error) {
      console.error('Error fetching week data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekData(selectedDate);
  }, [selectedDate]);

  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex flex-1">
        <Navbar />
        <main className="flex-1 p-8 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-teal-700 dark:text-teal-500">
                Weekly Progress Report
              </h2>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading progress data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {daysInWeek.map((date) => (
                  <DailyCard
                    key={format(date, 'yyyy-MM-dd')}
                    date={date}
                    progressData={weekData[format(date, 'yyyy-MM-dd')]}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewProgress;