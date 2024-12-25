import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/Badge";
import Header from '../Header';
import Navbar from '../Navbar';
import { Calendar, BookOpen, Book, BookMarked, ChevronDown } from "lucide-react";


const students = [
    { id: 1, name: "Ahmad Ali", rollNo: "QH-001", age: 12 },
    { id: 2, name: "Fatima Khan", rollNo: "QH-002", age: 11 },
    { id: 3, name: "Muhammad Omar", rollNo: "QH-003", age: 13 }
];



function ProgressMarking() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSabaqSubmit = (studentId) => {
        console.log(`Submitting Sabaq for student ${studentId}`);
    };

    const handleSabqiSubmit = (studentId) => {
        console.log(`Submitting Sabqi for student ${studentId}`);
    };

    const handleManzilSubmit = (studentId) => {
        console.log(`Submitting Manzil for student ${studentId}`);
    };

    

    return (
      <div className="flex flex-col h-screen bg-gray-50">
            <Header />
            <div className="flex flex-1">
                <Navbar />
                <main className="flex-1 p-8 overflow-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-2xl font-bold text-foreground">Mark Progress</h1>
                            <div className="flex items-center gap-2">
                                <Calendar className="text-teal-500" />
                                <Input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="border-teal-500 focus:ring-teal-500"
                                />
                            </div>
                        </div>

                <div className="space-y-6">
                    {students.map((student) => (
                        <Card key={student.id} className="border-l-4 border-l-teal-500">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center justify-between">
                                    <span>{student.name}</span>
                                    <span className="text-sm text-muted-foreground">Roll No: {student.rollNo}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {/* Sabaq Section */}
                                    <AccordionItem value={`sabaq-${student.id}`}>
                                        <AccordionTrigger className="hover:text-teal-500">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-5 w-5" />
                                                <span>Mark Sabaq</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-4 p-4">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id={`sabaq-completed-${student.id}`} />
                                                    <Label htmlFor={`sabaq-completed-${student.id}`}>Completed</Label>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Number of Lines</Label>
                                                        <Input type="number" className="mt-1" />
                                                    </div>
                                                    <div>
                                                        <Label>Starting Surah</Label>
                                                        <Input type="text" className="mt-1" />
                                                    </div>
                                                    <div>
                                                        <Label>Ending Surah</Label>
                                                        <Input type="text" className="mt-1" />
                                                    </div>
                                                    <div>
                                                        <Label>Starting Ayah</Label>
                                                        <Input type="number" className="mt-1" />
                                                    </div>
                                                    <div>
                                                        <Label>Ending Ayah</Label>
                                                        <Input type="number" className="mt-1" />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <Label>Remarks</Label>
                                                        <Textarea className="mt-1" />
                                                    </div>
                                                </div>
                                                <Button 
                                                    onClick={() => handleSabaqSubmit(student.id)}
                                                    className="w-full bg-teal-500 hover:bg-teal-600"
                                                >
                                                    Mark Sabaq
                                                </Button>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Sabqi Section */}
                                    <AccordionItem value={`sabqi-${student.id}`}>
                                        <AccordionTrigger className="hover:text-teal-500">
                                            <div className="flex items-center gap-2">
                                                <Book className="h-5 w-5" />
                                                <span>Mark Sabqi</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-4 p-4">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id={`sabqi-completed-${student.id}`} />
                                                    <Label htmlFor={`sabqi-completed-${student.id}`}>Completed</Label>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Juzz</Label>
                                                        <Input type="text" className="mt-1" />
                                                    </div>
                                                    <div>
                                                        <Label>Quality</Label>
                                                        <Select>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select quality" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="excellent">Excellent</SelectItem>
                                                                <SelectItem value="good">Good</SelectItem>
                                                                <SelectItem value="fair">Fair</SelectItem>
                                                                <SelectItem value="poor">Poor</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <Label>Remarks</Label>
                                                        <Textarea className="mt-1" />
                                                    </div>
                                                </div>
                                                <Button 
                                                    onClick={() => handleSabqiSubmit(student.id)}
                                                    className="w-full bg-teal-500 hover:bg-teal-600"
                                                >
                                                    Mark Sabqi
                                                </Button>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    {/* Manzil Section */}
                                    <AccordionItem value={`manzil-${student.id}`}>
                                        <AccordionTrigger className="hover:text-teal-500">
                                            <div className="flex items-center gap-2">
                                                <BookMarked className="h-5 w-5" />
                                                <span>Mark Manzil</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-4 p-4">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id={`manzil-completed-${student.id}`} />
                                                    <Label htmlFor={`manzil-completed-${student.id}`}>Completed</Label>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Juzz</Label>
                                                        <Input type="text" className="mt-1" />
                                                    </div>
                                                    <div>
                                                        <Label>Quality</Label>
                                                        <Select>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select quality" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="excellent">Excellent</SelectItem>
                                                                <SelectItem value="good">Good</SelectItem>
                                                                <SelectItem value="fair">Fair</SelectItem>
                                                                <SelectItem value="poor">Poor</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <Label>Remarks</Label>
                                                        <Textarea className="mt-1" />
                                                    </div>
                                                </div>
                                                <Button 
                                                    onClick={() => handleManzilSubmit(student.id)}
                                                    className="w-full bg-teal-500 hover:bg-teal-600"
                                                >
                                                    Mark Manzil
                                                </Button>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    ))}
  </div>
                    </div>
                </main>
            </div>
        </div>
    
    );
}

export default ProgressMarking;
