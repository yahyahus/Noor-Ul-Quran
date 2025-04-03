import React, { useEffect, useState } from 'react';
import { Users, UserPlus, X, CheckCircle2, AlertCircle } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import Header from '../Header';
import Navbar from '../Navbar';
import { fetchUnassignedStudents, fetchTeachers, assignStudent } from '../services/adminService';

const UnassignedStudentsList = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isAssignMode, setIsAssignMode] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsData, teachersData] = await Promise.all([
          fetchUnassignedStudents(),
          fetchTeachers()
        ]);
        setStudents(studentsData);
        setTeachers(teachersData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAssignClick = async () => {
    if (isAssignMode && selectedTeacher) {
      try {
        const response = await assignStudent(selectedStudents, selectedTeacher);
        if (response.ok) {
          setStudents((prev) => 
            prev.filter((student) => !selectedStudents.includes(student._id))
          );
          setSelectedStudents([]);
          setSelectedTeacher('');
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
          setIsAssignMode(false);
        }
      } catch (error) {
        console.error('Failed to assign students:', error);
      }
    } else {
      setIsAssignMode(true);
    }
  };

  const handleCancelClick = () => {
    setIsAssignMode(false);
    setSelectedStudents([]);
    setSelectedTeacher('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Assign Students</h2>
                <p className="text-sm text-gray-600">
                  {students.length} unassigned students available
                </p>
              </div>
              <div className="space-x-3">
                {isAssignMode && (
                  <Button
                    variant="outline"
                    onClick={handleCancelClick}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                )}
                <Button
                  onClick={handleAssignClick}
                  disabled={isAssignMode && (selectedStudents.length === 0 || !selectedTeacher)}
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  {isAssignMode ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Confirm Assignment
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign Students
                    </>
                  )}
                </Button>
              </div>
            </div>

            {showSuccess && (
              <Alert className="bg-teal-50 text-teal-800 border-teal-200">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Students have been successfully assigned to the teacher.
                </AlertDescription>
              </Alert>
            )}

            {isAssignMode && teachers.length > 0 && (
              <Card className="border-teal-100">
                <CardHeader className="py-4">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-teal-500" />
                    Select Teacher
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedTeacher}
                    onValueChange={setSelectedTeacher}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher._id} value={teacher._id}>
                          {teacher.firstname} {teacher.lastname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-teal-500" />
                  Unassigned Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {isAssignMode && (
                        <TableHead className="w-[50px]"></TableHead>
                      )}
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student._id}>
                        {isAssignMode && (
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student._id)}
                              onChange={() => handleCheckboxChange(student._id)}
                              className="h-4 w-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                            />
                          </TableCell>
                        )}
                        <TableCell>{student.firstname}</TableCell>
                        <TableCell>{student.lastname}</TableCell>
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

export default UnassignedStudentsList;