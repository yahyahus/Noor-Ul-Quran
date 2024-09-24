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
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Firstname</th>
                <th className="text-left">Lastname</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}> {/* Use _id as the unique key */}
                  <td>{student.firstname}</td> {/* Display firstname */}
                  <td>{student.lastname}</td> {/* Display lastname */}
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}

export default TeacherStudents;
