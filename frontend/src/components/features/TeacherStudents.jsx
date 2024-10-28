// components/TeacherStudents.jsx
import React, { useEffect, useState } from 'react';
import { fetchStudents } from '../services/studentservice';
import Header from '../Header';
import Navbar from '../Navbar';

function TeacherStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const getStudents = async () => {
      const data = await fetchStudents();
      setStudents(data);
    };

    getStudents();
  }, []);

  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Navbar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-semibold mb-4 text-gray-800">Students</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4 border-b-2 border-gray-300 text-gray-600">Firstname</th>
                  <th className="text-left py-2 px-4 border-b-2 border-gray-300 text-gray-600">Lastname</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id || index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b border-gray-300">{student.firstname}</td>
                    <td className="py-2 px-4 border-b border-gray-300">{student.lastname}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TeacherStudents;
