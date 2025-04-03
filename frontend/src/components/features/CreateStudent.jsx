import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createStudent, createTeacher } from '../services/adminService';
import Header from '../Header';
import Navbar from '../Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, GraduationCap, BookOpen } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Form validation schema
const userSchema = z.object({
  firstname: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters')
    .trim(),
  lastname: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters')
    .trim(),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
});

const CreateUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register: registerStudentField,
    handleSubmit: handleStudentSubmit,
    formState: { errors: studentErrors },
  } = useForm({
    resolver: zodResolver(userSchema)
  });

  const {
    register: registerTeacherField,
    handleSubmit: handleTeacherSubmit,
    formState: { errors: teacherErrors },
  } = useForm({
    resolver: zodResolver(userSchema)
  });

  const handleCreateStudent = async (data) => {
    try {
      const result = await createStudent(
        data.username,
        data.password,
        data.firstname,
        data.lastname
      );
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Student account created successfully!",
          variant: "default",
        });
        navigate('/portal');
      } else {
        toast({
          variant: "destructive",
          title: "Creation Failed",
          description: result.message || 'Failed to create student account.',
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleCreateTeacher = async (data) => {
    try {
      const result = await createTeacher(
        data.username,
        data.password,
        data.firstname,
        data.lastname
      );
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Teacher account created successfully!",
          variant: "default",
        });
        navigate('/portal');
      } else {
        toast({
          variant: "destructive",
          title: "Creation Failed",
          description: result.message || 'Failed to create teacher account.',
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Navbar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <BookOpen className="h-8 w-8 text-teal-600 mr-2" />
              <h1 className="text-3xl font-bold text-foreground">Create New Users</h1>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Student Form */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-center space-x-2">
                    <GraduationCap className="h-6 w-6 text-teal-600" />
                    <CardTitle className="text-2xl">Create Student</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleStudentSubmit(handleCreateStudent)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Input
                          placeholder="First Name"
                          {...registerStudentField('firstname')}
                          className="border-border/40 bg-background/95"
                        />
                        {studentErrors.firstname && (
                          <p className="text-sm text-red-500">{studentErrors.firstname.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Input
                          placeholder="Last Name"
                          {...registerStudentField('lastname')}
                          className="border-border/40 bg-background/95"
                        />
                        {studentErrors.lastname && (
                          <p className="text-sm text-red-500">{studentErrors.lastname.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Input
                        placeholder="Username"
                        {...registerStudentField('username')}
                        className="border-border/40 bg-background/95"
                      />
                      {studentErrors.username && (
                        <p className="text-sm text-red-500">{studentErrors.username.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Password"
                        {...registerStudentField('password')}
                        className="border-border/40 bg-background/95"
                      />
                      {studentErrors.password && (
                        <p className="text-sm text-red-500">{studentErrors.password.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      <UserPlus className="mr-2 h-4 w-4" /> Create Student
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Teacher Form */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-center space-x-2">
                    <BookOpen className="h-6 w-6 text-teal-600" />
                    <CardTitle className="text-2xl">Create Teacher</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTeacherSubmit(handleCreateTeacher)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Input
                          placeholder="First Name"
                          {...registerTeacherField('firstname')}
                          className="border-border/40 bg-background/95"
                        />
                        {teacherErrors.firstname && (
                          <p className="text-sm text-red-500">{teacherErrors.firstname.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Input
                          placeholder="Last Name"
                          {...registerTeacherField('lastname')}
                          className="border-border/40 bg-background/95"
                        />
                        {teacherErrors.lastname && (
                          <p className="text-sm text-red-500">{teacherErrors.lastname.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Input
                        placeholder="Username"
                        {...registerTeacherField('username')}
                        className="border-border/40 bg-background/95"
                      />
                      {teacherErrors.username && (
                        <p className="text-sm text-red-500">{teacherErrors.username.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Password"
                        {...registerTeacherField('password')}
                        className="border-border/40 bg-background/95"
                      />
                      {teacherErrors.password && (
                        <p className="text-sm text-red-500">{teacherErrors.password.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      <UserPlus className="mr-2 h-4 w-4" /> Create Teacher
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateUser;