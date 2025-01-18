import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, BookOpen, Book, BookMarked, ChevronDown, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Header from "../Header";
import Navbar from "../Navbar";

const mockData = [
    {
        date: "Monday",
        sabaq: {
            completed: true,
            numberOfLines: 20,
            startingSurah: { number: 1, name: "Al-Fatiha" },
            endingSurah: { number: 2, name: "Al-Baqarah" },
            startingAyah: 1,
            endingAyah: 5,
            remarks: "Excellent start",
        },
        sabqi: {
            completed: true,
            juzz: { number: 1, name: "Alif Lam Meem" },
            quality: 5,
            remarks: "Flawless recitation",
        },
        manzil: {
            completed: false,
            juzz: { number: 2, name: "Sayaqul" },
            quality: 3,
            remarks: "Needs improvement",
        },
    },
    {
        date: "Tuesday",
        sabaq: {
            completed: true,
            numberOfLines: 15,
            startingSurah: { number: 2, name: "Al-Baqarah" },
            endingSurah: { number: 2, name: "Al-Baqarah" },
            startingAyah: 6,
            endingAyah: 10,
            remarks: "Good consistency",
        },
        sabqi: {
            completed: false,
            juzz: { number: 1, name: "Alif Lam Meem" },
            quality: 3,
            remarks: "Missed key points",
        },
        manzil: {
            completed: true,
            juzz: { number: 2, name: "Sayaqul" },
            quality: 4,
            remarks: "Good progress",
        },
    },
    {
        date: "Wednesday",
        sabaq: {
            completed: false,
            numberOfLines: 10,
            startingSurah: { number: 2, name: "Al-Baqarah" },
            endingSurah: { number: 2, name: "Al-Baqarah" },
            startingAyah: 11,
            endingAyah: 15,
            remarks: "Missed key points",
        },
        sabqi: {
            completed: true,
            juzz: { number: 1, name: "Alif Lam Meem" },
            quality: 4,
            remarks: "Good progress",
        },
        manzil: {
            completed: true,
            juzz: { number: 2, name: "Sayaqul" },
            quality: 5,
            remarks: "Excellent recitation",
        },
    },
    {
        date: "Thursday",
        sabaq: {
            completed: true,
            numberOfLines: 12,
            startingSurah: { number: 2, name: "Al-Baqarah" },
            endingSurah: { number: 2, name: "Al-Baqarah" },
            startingAyah: 16,
            endingAyah: 20,
            remarks: "Good progress",
        },
        sabqi: {
            completed: true,
            juzz: { number: 1, name: "Alif Lam Meem" },
            quality: 5,
            remarks: "Excellent recitation",
        },
        manzil: {
            completed: false,
            juzz: { number: 2, name: "Sayaqul" },
            quality: 3,
            remarks: "Needs improvement",
        },
    },
    {
        date: "Friday",
        sabaq: {
            completed: false,
            numberOfLines: 14,
            startingSurah: { number: 2, name: "Al-Baqarah" },
            endingSurah: { number: 2, name: "Al-Baqarah" },
            startingAyah: 21,
            endingAyah: 25,
            remarks: "Missed key points",
        },
        sabqi: {
            completed: true,
            juzz: { number: 1, name: "Alif Lam Meem" },
            quality: 4,
            remarks: "Good progress",
        },
        manzil: {
            completed: true,
            juzz: { number: 2, name: "Sayaqul" },
            quality: 5,
            remarks: "Excellent recitation",
        },
    },
    {
        date: "Saturday",
        sabaq: {
            completed: true,
            numberOfLines: 20,
            startingSurah: { number: 2, name: "Al-Baqarah" },
            endingSurah: { number: 3, name: "Al-Imran" },
            startingAyah: 1,
            endingAyah: 5,
            remarks: "Good progress",
        },
        sabqi: {
            completed: false,
            juzz: { number: 2, name: "Sayaqul" },
            quality: 3,
            remarks: "Needs improvement",
        },
        manzil: {
            completed: true,
            juzz: { number: 3, name: "Tilkal Rusul" },
            quality: 4,
            remarks: "Good progress",
        },
    },
];


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

const ProgressSection = ({ title, icon: Icon, data, isExpanded }) => (
  <div className={`h-full ${isExpanded ? 'bg-gray-50 dark:bg-gray-800 rounded-lg p-4' : ''}`}>
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-teal-600" />
        <span className="font-medium text-gray-700 dark:text-gray-200">{title}</span>
      </div>
      <StatusBadge completed={data.completed} />
    </div>
    
    {/* Essential info shown always */}
    <div className="text-sm text-gray-600 mb-2">
      {title === "Sabaq" && (
        <span className="font-medium">{data.numberOfLines} lines</span>
      )}
      {(title === "Sabqi" || title === "Manzil") && (
        <span className="font-medium">Juzz: {data.juzz.name}</span>
      )}
    </div>

    {/* Expanded content */}
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
      isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
    }`}>
      <div className="space-y-4">
        {title === "Sabaq" && (
          <>
            <DetailBox title="Starting" value={`${data.startingSurah.name} (${data.startingAyah})`} icon={ArrowRight} />
            <DetailBox title="Ending" value={`${data.endingSurah.name} (${data.endingAyah})`} icon={ArrowRight} />
          </>
        )}

        {(title === "Sabqi" || title === "Manzil") && (
          <DetailBox 
            title="Quality" 
            value={`${data.quality}/5`} 
            icon={ArrowRight}
          />
        )}

        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">Remarks</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{data.remarks}</p>
        </div>
      </div>
    </div>
  </div>
);

const DailyCard = ({ day }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={`border-l-4 border-l-teal-500 transition-all duration-300 ${
      isExpanded ? 'col-span-full' : ''
    }`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            {day.date}
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
            data={day.sabaq}
            isExpanded={isExpanded}
          />
          <ProgressSection
            title="Sabqi"
            icon={Book}
            data={day.sabqi}
            isExpanded={isExpanded}
          />
          <ProgressSection
            title="Manzil"
            icon={BookMarked}
            data={day.manzil}
            isExpanded={isExpanded}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const ViewProgress = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex flex-1">
        <Navbar />
        <main className="flex-1 p-8 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold text-teal-700 dark:text-teal-500 mb-6">
              Weekly Progress Report
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockData.map((day, index) => (
                <DailyCard key={index} day={day} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewProgress;