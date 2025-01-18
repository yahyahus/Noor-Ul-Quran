import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, BookOpen, Book, BookMarked, Check, X, User } from "lucide-react";
import Header from "../Header";
import Navbar from "../Navbar";
import { PageLoader, ActionLoader } from "./Loader";
import { fetchStudentProgress } from "../services/studentservice";
import { markSabaq, markSabqi, markManzil } from "../services/teacherService";
import { fetchJuzzNames } from "../services/generalService";
import { use } from "react";

function ProgressMarking() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [students, setStudents] = useState([]);
    const [completionStatus, setCompletionStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateLoading, setDateLoading] = useState(false);
    const [juzzNames, setJuzzNames] = useState({});

    const [sabaq, setSabaq] = useState({
        completed: false,
        numberOfLines: 0,
        startingSurah: "",
        startingSurahNumber: 0,
        endingSurah: "",
        endingSurahNumber: 0,
        startingAyah: 0,
        endingAyah: 0,
        remarks: "",
    });

const [sabqi, setSabqi] = useState({
    completed: false,
    juzz: 0,
    juzzName: "",
    quality: 0,
    remarks: ""
});

const [manzil, setManzil] = useState({
    completed: false,
    juzz: 0,
    juzzName: "",
    quality: 0,
    remarks: ""
});


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const juzzNames = await fetchJuzzNames();
                setJuzzNames(juzzNames);

            } catch (err) {
                setError("Failed to load juzz names");
                console.error("Error loading data:", err);
            } finally {
                setLoading(false);
            }

        };
        fetchData();
    }, []);



    useEffect(() => {
        const loadStudentData = async () => {
            try {
                setLoading(true);
                const studentData = await fetchStudentProgress(selectedDate);
                const studentsList = studentData.map((data) => ({
                    _id: data.studentId,
                    firstname: data.firstname,
                    lastname: data.lastname,
                }));
                const progressData = studentData.reduce((acc, data) => {
                    acc[data.studentId] = {
                        sabaq: data.sabaq || {},
                        sabqi: data.sabqi || {},
                        manzil: data.manzil || {},
                    };
                    return acc;
                }, {});
    
                setStudents(studentsList);
                setCompletionStatus(progressData);
            } catch (err) {
                setError("Failed to load students or progress data");
                console.error("Error loading data:", err);
            } finally {
                setLoading(false);
            }
        };
    
        loadStudentData();
    }, [selectedDate]);

    const handleSabaqSubmit = async (studentId) => {
        try {
            setDateLoading(true);
            const response = await markSabaq(studentId, selectedDate, sabaq);
            setCompletionStatus(prevStatus => ({
                ...prevStatus,
                [studentId]: {
                    ...prevStatus[studentId],
                    sabaq: {
                        ...prevStatus[studentId]?.sabaq,
                        ...sabaq
                    }
                }
            }));
        } catch (err) {
            console.error("Error marking Sabaq:", err);
        } finally {
            setDateLoading(false);
        }
    };

    const handleSabqiSubmit = async (studentId) => {
        try {
            setDateLoading(true);
            console.log(studentId, selectedDate, sabqi);
            const response = await markSabqi(studentId, selectedDate, {
                ...sabqi,
                juzz: {
                    number: sabqi.juzz,
                    name: sabqi.juzzName
                }
            });
            setCompletionStatus(prevStatus => ({
                ...prevStatus,
                [studentId]: {
                    ...prevStatus[studentId],
                    sabqi: {
                        ...prevStatus[studentId]?.sabqi,
                        ...sabqi
                    }
                }
            }));
        } catch (err) {
            console.error("Error marking Sabqi:", err);
        } finally {
            setDateLoading(false);
        }
    };
    
    const handleManzilSubmit = async (studentId) => {
        try {

            setDateLoading(true);

            //logging the studentId, selectedDate and manzil
            console.log(studentId, selectedDate, manzil);
            const response = await markManzil(studentId, selectedDate, {
                ...manzil,
                juzz: {
                    number: manzil.juzz,
                    name: manzil.juzzName
                }
            });
            setCompletionStatus(prevStatus => ({
                ...prevStatus,
                [studentId]: {
                    ...prevStatus[studentId],
                    manzil: {
                        ...prevStatus[studentId]?.manzil,
                        ...manzil
                    }
                }
            }));
        } catch (err) {
            console.error("Error marking Manzil:", err);
        } finally {
            setDateLoading(false);
        }
    };
    

    if (loading) {
        return <PageLoader />;
    }

    if (error) {
        return (
            <div className="flex flex-col h-screen bg-gray-50">
                <Header />
                <div className="flex flex-1">
                    <Navbar />
                    <main className="flex-1 p-8 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-lg text-red-600 mb-4">{error}</p>
                            <Button
                                onClick={() => window.location.reload()}
                                className="bg-teal-500 hover:bg-teal-600"
                            >
                                Retry
                            </Button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

   const getStatusBadge = (isCompleted) => (
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isCompleted 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-gray-50 text-gray-600 border border-gray-200'
        }`}>
            {isCompleted ? 'Completed' : 'Pending'}
        </div>
    );

    

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Header />
            <div className="flex flex-1">
                <Navbar />
                <main className="flex-1 p-8 overflow-auto bg-gray-50">
                    <div className="max-w-4xl mx-auto">
                        {/* Breadcrumb navigation */}
                        <nav className="mb-6">
                            <ol className="flex items-center space-x-2 text-sm text-gray-500">
                                <li>Dashboard</li>
                                <li className="flex items-center space-x-2">
                                    <span>/</span>
                                    <span className="text-teal-600 font-medium">Student Progress</span>
                                </li>
                            </ol>
                        </nav>

                        {/* Date selector with improved calendar interaction */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative group cursor-pointer">
                                        <Calendar className="text-teal-500 h-5 w-5 transition-colors group-hover:text-teal-600" />
                                        <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 -mt-1 left-full ml-2 whitespace-nowrap">
                                            Select date
                                        </div>
                                    </div>
                                    <Input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="border-gray-200 focus:ring-teal-500 focus:border-teal-500 cursor-pointer hover:border-teal-500 transition-colors"
                                    />
                                </div>
                                <div className="text-sm text-gray-500">
                                    {students.length} students
                                </div>
                            </div>
                        </div>

                        {dateLoading && (
                            <ActionLoader message="Updating student progress..." />
                        )}

                        {students.length === 0 ? (
                            <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
                                <p className="text-gray-600">No students found</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {students.map((student) => (
                                    <Card key={student._id} className="border-l-4 border-l-teal-500 shadow-sm hover:shadow-md transition-all duration-200">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg flex items-center justify-between">
                                                <span className="font-semibold text-gray-800">{student.firstname} {student.lastname}</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Accordion type="single" collapsible className="w-full">
                                                {/* Sabaq Section */}
                                                <AccordionItem value={`sabaq-${student._id}`}>
                                                    <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-lg transition-all duration-200">
                                                        <div className="flex items-center justify-between w-full">
                                                            <div className="flex items-center gap-3">
                                                                <BookOpen className="h-5 w-5 text-teal-500" />
                                                                <span className="font-medium text-gray-700">Sabaq</span>
                                                            </div>
                                                            {getStatusBadge(completionStatus[student._id]?.sabaq?.completed)}
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-4">
                                                       <div className="space-y-4 p-4">
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={`sabaq-completed-${student._id}`}
                                                                    checked={sabaq.completed}
                                                                    onCheckedChange={(checked) => {
                                                                        setSabaq(prev => ({
                                                                            ...prev,
                                                                            completed: checked
                                                                        }));
                                                                    }}
                                                                />
                                                                <Label htmlFor={`sabaq-completed-${student._id}`}>
                                                                    Mark as Completed
                                                                </Label>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <Label>Number of Lines</Label>
                                                                    <Input
                                                                        type="number"
                                                                        className="mt-1"
                                                                        onChange={(e) => setSabaq({ ...sabaq, numberOfLines: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>Starting Surah</Label>
                                                                    <Input
                                                                        type="text"
                                                                        className="mt-1"
                                                                        onChange={(e) => setSabaq({ ...sabaq, startingSurah: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>Starting Surah Number</Label>
                                                                    <Input
                                                                        type="number"
                                                                        className="mt-1"
                                                                        onChange={(e) => setSabaq({ ...sabaq, startingSurahNumber: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>Ending Surah</Label>
                                                                    <Input
                                                                        type="text"
                                                                        className="mt-1"
                                                                        onChange={(e) => setSabaq({ ...sabaq, endingSurah: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>Ending Surah Number</Label>
                                                                    <Input
                                                                        type="number"
                                                                        className="mt-1"
                                                                        onChange={(e) => setSabaq({ ...sabaq, endingSurahNumber: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>Starting Ayah</Label>
                                                                    <Input
                                                                        type="number"
                                                                        className="mt-1"
                                                                        onChange={(e) => setSabaq({ ...sabaq, startingAyah: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>Ending Ayah</Label>
                                                                    <Input
                                                                        type="number"
                                                                        className="mt-1"
                                                                        onChange={(e) => setSabaq({ ...sabaq, endingAyah: e.target.value })}
                                                                    />
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <Label>Remarks</Label>
                                                                    <Textarea
                                                                        className="mt-1"
                                                                        onChange={(e) => setSabaq({ ...sabaq, remarks: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <Button
                                                                onClick={() => handleSabaqSubmit(student._id)}
                                                                className="w-full bg-teal-500 hover:bg-teal-600"
                                                            >
                                                                Mark Sabaq
                                                            </Button>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>

                                                {/* Sabqi Section */}
                                                <AccordionItem value={`sabqi-${student._id}`}>
                                                    <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-lg transition-all duration-200">
                                                        <div className="flex items-center justify-between w-full">
                                                            <div className="flex items-center gap-3">
                                                                <Book className="h-5 w-5 text-teal-500" />
                                                                <span className="font-medium text-gray-700">Sabqi</span>
                                                            </div>
                                                            {getStatusBadge(completionStatus[student._id]?.sabqi?.completed)}
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-4">
   <div className="space-y-4 p-4">
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={`sabqi-completed-${student._id}`}
                                                                    checked={sabqi.completed}
                                                                    onCheckedChange={(checked) => {
                                                                        setSabqi(prev => ({
                                                                            ...prev,
                                                                            completed: checked
                                                                        }));
                                                                    }}

                                                                />
                                                                <Label htmlFor={`sabqi-completed-${student._id}`}>Mark as Completed</Label>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                               <div>
    <Label>Juzz</Label>
    <Select
    onValueChange={(value) => setSabqi(prev => ({
        ...prev,
        juzz: parseInt(value),
        juzzName: juzzNames[value]
    }))}
>
    <SelectTrigger>
        <SelectValue placeholder="Select Juzz" />
    </SelectTrigger>
    <SelectContent>
        {Object.entries(juzzNames).map(([juzzNumber, juzzName]) => (
            <SelectItem 
                key={juzzNumber} 
                value={juzzNumber}
                className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
            >
                <span className="block truncate">
                    {juzzNumber} ({juzzName})
                </span>
            </SelectItem>
        ))}
    </SelectContent>
</Select>


</div>      <div>
                                                                    <Label>Quality</Label>
                                                                   { /* a number selection from 1-5 to mark quality */}
                                                                    <Select
                                                                        onValueChange={(value) =>
                                                                            setSabqi({ ...sabqi, quality: value })  
                                                                        }
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select quality" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="1">1</SelectItem>
                                                                            <SelectItem value="2">2</SelectItem>
                                                                            <SelectItem value="3">3</SelectItem>
                                                                            <SelectItem value="4">4</SelectItem>
                                                                            <SelectItem value="5">5</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>

                                                                </div>
                                                                <div className="col-span-2">
                                                                    <Label>Remarks</Label>
                                                                    <Textarea 
                                                                        className="mt-1"
                                                                        onChange={(e) => setSabqi({ ...sabqi, remarks: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <Button 
                                                                onClick={() => handleSabqiSubmit(student._id)}
                                                                className="w-full bg-teal-500 hover:bg-teal-600"
                                                            >
                                                                Mark Sabqi
                                                            </Button>
                                                        </div>                                                    </AccordionContent>
                                                </AccordionItem>

                                                {/* Manzil Section */}
                                                <AccordionItem value={`manzil-${student._id}`}>
                                                    <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-lg transition-all duration-200">
                                                        <div className="flex items-center justify-between w-full">
                                                            <div className="flex items-center gap-3">
                                                                <BookMarked className="h-5 w-5 text-teal-500" />
                                                                <span className="font-medium text-gray-700">Manzil</span>
                                                            </div>
                                                            {getStatusBadge(completionStatus[student._id]?.manzil?.completed)}
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-4">
 <div className="space-y-4 p-4">
                                                            <div className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={`manzil-completed-${student._id}`}
                                                                    checked={manzil.completed}
                                                                    onCheckedChange={(checked) => {
                                                                        setManzil(prev => ({
                                                                            ...prev,
                                                                            completed: checked
                                                                        }));
                                                                    }}
                                                                />
                                                                <Label htmlFor={`manzil-completed-${student._id}`}>Mark as Completed</Label>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                            <div>
    <Label>Juzz</Label>
    <Select
    onValueChange={(value) => setManzil(prev => ({
        ...prev,
        juzz: parseInt(value),
        juzzName: juzzNames[value]
    }))}
>
    <SelectTrigger>
        <SelectValue placeholder="Select Juzz" />
    </SelectTrigger>
    <SelectContent>
        {Object.entries(juzzNames).map(([juzzNumber, juzzName]) => (
            <SelectItem 
                key={juzzNumber} 
                value={juzzNumber}
                className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
            >
                <span className="block truncate">
                    {juzzNumber} ({juzzName})
                </span>
            </SelectItem>
        ))}
    </SelectContent>
</Select>

</div>
                                                                <div>
                                                                    <Label>Quality</Label>
                                                                    <Select
                                                                       onValueChange={(value) => setManzil(prev => ({
                                                                        ...prev,
                                                                        quality: parseInt(value)
                                                                    }))}
                                                                    
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select quality" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="1">1</SelectItem>
                                                                            <SelectItem value="2">2</SelectItem>
                                                                            <SelectItem value="3">3</SelectItem>
                                                                            <SelectItem value="4">4</SelectItem>
                                                                            <SelectItem value="5">5</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <Label>Remarks</Label>
                                                                    <Textarea 
                                                                        className="mt-1"
                                                                        onChange={(e) => setManzil({ ...manzil, remarks: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <Button 
                                                                onClick={() => handleManzilSubmit(student._id)}
                                                                className="w-full bg-teal-500 hover:bg-teal-600"
                                                            >
                                                                Mark Manzil
                                                            </Button>
                                                        </div>                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );

}

export default ProgressMarking;