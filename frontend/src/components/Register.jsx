import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setRole } from '../store/slices/roleSlice';
import { register } from './services/authService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, UserPlus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Form validation schema
const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    ,
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  firstname: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters')
    .trim(),
  lastname: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters')
    .trim(),
  role: z.enum(['student', 'teacher', 'admin'], {
    required_error: 'Role is required',
    invalid_type_error: 'Role must be either student, teacher, or admin'
  })
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.role);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: role
    }
  });

  const onSubmit = async (data) => {
    try {
      const result = await register(
        data.username,
        data.password,
        data.firstname,
        data.lastname,
        navigate
      );
      
      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: result.message,
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

  const handleRoleChange = (value) => {
    dispatch(setRole(value));
    setValue('role', value);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative section */}
      <div className="hidden lg:flex w-1/2 bg-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circles" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#circles)" />
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <BookOpen className="h-24 w-24 mb-8" />
          <h1 className="text-4xl font-bold mb-4">Begin Your Journey</h1>
          <p className="text-xl text-center text-teal-100 max-w-md">
            Join our community of learners and educators. Start your Quranic education
            journey with a personalized learning experience.
          </p>
          
          <div className="absolute top-1/4 right-0 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob"/>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-teal-600 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"/>
        </div>
      </div>

      {/* Right register section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <BookOpen className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              <CardTitle className="text-2xl font-bold text-center">
                Create an Account
              </CardTitle>
            </div>
            <p className="text-center text-muted-foreground">
              Enter your information to create your account
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="First Name"
                    {...registerField('firstname')}
                    className="border-border/40 bg-background/95"
                  />
                  {errors.firstname && (
                    <p className="text-sm text-red-500">{errors.firstname.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Last Name"
                    {...registerField('lastname')}
                    className="border-border/40 bg-background/95"
                  />
                  {errors.lastname && (
                    <p className="text-sm text-red-500">{errors.lastname.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Input
                  placeholder="Email"
                  {...registerField('username')}
                  className="border-border/40 bg-background/95"
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  {...registerField('password')}
                  className="border-border/40 bg-background/95"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Select
                  value={role}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger className="border-border/40 bg-background/95">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                <UserPlus className="mr-2 h-4 w-4" /> Create Account
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium"
              >
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;