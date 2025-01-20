// RegisterPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useState } from 'react'
import { Link } from 'react-router-dom';
function RegisterPage() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.role);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async () => {
    try {
      const result = await register(email, password, firstname, lastname, navigate);
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
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
  );
}

export default RegisterPage;