import React from 'react';
import { Users, UserCheck, Plus, School, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from '../Header';
import Navbar from '../Navbar';

// Mock data for teachers
const teachersData = [
  { id: 1, name: "Sarah Johnson", section: "A1", studentCount: 25 },
  { id: 2, name: "Michael Chen", section: "B2", studentCount: 22 },
  { id: 3, name: "Emma Davis", section: "C1", studentCount: 28 },
  { id: 4, name: "James Wilson", section: "A2", studentCount: 24 },
  { id: 5, name: "Maria Garcia", section: "B1", studentCount: 26 }
];

const AdminDashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="h-full space-y-6">
            {/* Dashboard Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h2>
              <div className="space-x-3">
                <Button className="bg-teal-500 hover:bg-teal-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Teacher
                </Button>
                <Button className="bg-teal-500 hover:bg-teal-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
                <Button className="bg-teal-500 hover:bg-teal-600">
                  <School className="h-4 w-4 mr-2" />
                  Assign Sections
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-medium">Total Students</CardTitle>
                  <Users className="h-5 w-5 text-teal-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-teal-600">245</div>
                  <p className="text-sm text-gray-500">Across all sections</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-medium">Total Teachers</CardTitle>
                  <UserCheck className="h-5 w-5 text-teal-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-teal-600">12</div>
                  <p className="text-sm text-gray-500">Active faculty members</p>
                </CardContent>
              </Card>
            </div>

            {/* Teachers Table */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-medium">Teachers Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <Button variant="ghost" className="flex items-center gap-1 p-0 h-auto font-medium">
                          Name
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="flex items-center gap-1 p-0 h-auto font-medium">
                          Section
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" className="flex items-center gap-1 p-0 h-auto font-medium">
                          Students
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachersData.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell>{teacher.section}</TableCell>
                        <TableCell>{teacher.studentCount}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-teal-500 hover:text-teal-600">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
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

export default AdminDashboard;