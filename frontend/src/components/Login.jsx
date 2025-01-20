// LoginPage.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from './services/authService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, LogIn } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react'

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      const result = await login(email, password, navigate);
      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Login Failed",
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
              Noor-Ul-Quran
            </CardTitle>
          </div>
          <p className="text-center text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-border/40 bg-background/95"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-border/40 bg-background/95"
            />
          </div>
          <Button
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleLogin}
          >
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium"
            >
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
