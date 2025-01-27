// RegisterPage.jsx
import React, { useState } from 'react';
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

const RegisterPage = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.role);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [response, setResponse] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async () => {
    try {
      const result = await register(email, password, firstname, lastname, navigate);
      setResponse(result.message);
      
      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: result.message,
        });
      }
    } catch (error) {
      setResponse("An unexpected error occurred. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
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
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="First Name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="border-border/40 bg-background/95"
              />
              <Input
                type="text"
                placeholder="Last Name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="border-border/40 bg-background/95"
              />
            </div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border/40 bg-background/95"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-border/40 bg-background/95"
            />
            <Select
              value={role}
              onValueChange={(value) => dispatch(setRole(value))}
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
            {response && (
              <p className="text-center text-red-500 text-sm">{response}</p>
            )}
            <Button
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleRegister}
            >
              <UserPlus className="mr-2 h-4 w-4" /> Create Account
            </Button>
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
