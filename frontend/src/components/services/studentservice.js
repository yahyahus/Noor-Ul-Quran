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
        const response = await fetch(
            `http://localhost:5000/teacher/get-student-progress?date=${date}`,
            {
                method: 'GET',
                credentials: 'include',
            }
        );

        if (response.ok) {
            const data = await response.json();
            return data;
        }
        console.error('Failed to fetch student progress');
        return [];
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


  const getProgress = async (date) => {
    try {
        const response = await fetch(`http://localhost:5000/student/view-progress?date=${date}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('Fetching progress for date:', date);
            const data = await response.json();
            console.log('Progress fetched successfully:', data);
            return data;
        } else {
            const errorData = await response.json();
            console.error('Failed to fetch progress:', errorData.message);
            return { message: errorData.message || 'Failed to fetch progress' };
        }
    } catch (error) {
        console.error('Error fetching progress:', error);
        return { message: 'Failed to fetch progress' };
    }
};

  
  export { fetchStudents, fetchAttendance, fetchStudentProgress , getProgress};
  