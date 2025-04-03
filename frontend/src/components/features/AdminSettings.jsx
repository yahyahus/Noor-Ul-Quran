import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Lock, Mail, Globe, Moon, Shield, User } from "lucide-react";
import Header from '../Header';
import Navbar from '../Navbar';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [language, setLanguage] = useState("English");

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 p-4 bg-gray-50 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Page Header */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
              <p className="text-sm text-gray-600">Manage your account preferences and settings</p>
            </div>

            {/* Profile Section */}
            <Card className="shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-teal-500" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src="/api/placeholder/64/64"
                      alt="Profile Picture"
                      className="w-16 h-16 rounded-full bg-gray-100"
                    />
                    <div className="absolute -bottom-1 -right-1">
                      <Button size="sm" variant="outline" className="rounded-full w-8 h-8 p-0 flex items-center justify-center bg-white">
                        <Upload className="w-4 h-4 text-teal-600" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Profile Picture</h4>
                    <p className="text-sm text-gray-500 mt-1">Upload a new profile picture</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-teal-500" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Password</h4>
                  <div className="space-y-2">
                    <Input type="password" placeholder="Current Password" className="bg-white" />
                    <Input type="password" placeholder="New Password" className="bg-white" />
                    <Button className="bg-teal-600 hover:bg-teal-700">Update Password</Button>
                  </div>
                </div>
                
                <div className="space-y-3 pt-2">
                  <h4 className="font-medium text-gray-900">Email Address</h4>
                  <div className="space-y-2">
                    <Input type="email" placeholder="New Email Address" className="bg-white" />
                    <Button className="bg-teal-600 hover:bg-teal-700">Update Email</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <Switch 
                    checked={twoFactor} 
                    onCheckedChange={setTwoFactor}
                    className="data-[state=checked]:bg-teal-600"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Globe className="h-4 w-4 text-teal-500" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Language</h4>
                    <p className="text-sm text-gray-500">Choose your preferred language</p>
                  </div>
                  <select
                    className="border rounded-md py-2 px-3 bg-white text-sm"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Dark Mode</h4>
                    <p className="text-sm text-gray-500">Toggle dark mode theme</p>
                  </div>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode}
                    className="data-[state=checked]:bg-teal-600"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}