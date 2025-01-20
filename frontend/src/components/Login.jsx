import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from './services/authService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, LogIn } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');
  const [readOnly, setReadOnly] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      const result = await login(email, password, navigate);
      setResponse(result.message);
      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Login Failed",
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
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <BookOpen className="h-24 w-24 mb-8" />
          <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
          <p className="text-xl text-center text-teal-100 max-w-md">
            Your journey in Quranic learning continues here.
          </p>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"/>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-700 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"/>
        </div>
      </div>

      {/* Right login section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
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
                readOnly={readOnly}
                onFocus={() => setReadOnly(false)}
                onBlur={() => setReadOnly(true)}
                onChange={(e) => setEmail(e.target.value)}
                className="border-border/40 bg-background/95"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                readOnly={readOnly}
                onFocus={() => setReadOnly(false)}
                onBlur={() => setReadOnly(true)}
                onChange={(e) => setPassword(e.target.value)}
                className="border-border/40 bg-background/95"
              />
            </div>
            {response && (
              <p className="text-center text-red-500 text-sm">{response}</p>
            )}
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
    </div>
  );
};

export default LoginPage;