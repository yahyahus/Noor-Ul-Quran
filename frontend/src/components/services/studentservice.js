// services/studentservice.js
const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/teacher/get-students', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) 
      {
        const data = await response.json();
        return data; 
      } else {
        console.error('Failed to fetch students');
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch students', error);
      return [];
    }
  };
  const fetchStudentProgress = async (date) => {
    try {
      const response = await fetch(`http://localhost:5000/teacher/get-student-progress?date=${date}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        return data; // Return the progress data
      } else {
        console.error('Failed to fetch student progress');
        return []; // Return an empty array in case of failure
      }
    } catch (error) {
      console.error('Failed to fetch student progress', error);
      return [];
    }
  };
  

  const fetchAttendance = async (month, year) => {
    try {
      const response = await fetch(`http://localhost:5000/student/attendance?month=${month}&year=${year}`, {
        method: 'GET',
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
        return data.attendanceList || []; // Accessing the attendance list directly
      } else {
        console.error('Failed to fetch attendance');
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch attendance', error);
      return [];
    }
  }

  
  export { fetchStudents, fetchAttendance, fetchStudentProgress };
  