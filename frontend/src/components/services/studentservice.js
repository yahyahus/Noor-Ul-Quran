// services/studentservice.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/teacher/get-students`, {
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
            `${API_BASE_URL}/teacher/get-student-progress?date=${date}`,
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
      const response = await fetch(`${API_BASE_URL}/student/attendance?month=${month}&year=${year}`, {
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
        const response = await fetch(`${API_BASE_URL}/student/view-progress?date=${date}`, {
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

// Add these functions to studentService.js

const getTodayProgress = async () => {
  try {
      const response = await fetch(`${API_BASE_URL}/student/today-progress`, {
          method: 'GET',
          credentials: 'include',
      });

      if (response.ok) {
          const data = await response.json();
          return data.data;
      }
      console.error('Failed to fetch today\'s progress');
      return null;
  } catch (error) {
      console.error('Failed to fetch today\'s progress', error);
      return null;
  }
};

const getWeeklyProgress = async () => {
  try {
      const response = await fetch(`${API_BASE_URL}/student/weekly-progress`, {
          method: 'GET',
          credentials: 'include',
      });

      if (response.ok) {
          const data = await response.json();
          return data.data;
      }
      console.error('Failed to fetch weekly progress');
      return null;
  } catch (error) {
      console.error('Failed to fetch weekly progress', error);
      return null;
  }
};

const getCurrentJuzzInfo = async () => {
  try {
      const response = await fetch(`${API_BASE_URL}/student/current-juzz`, {
          method: 'GET',
          credentials: 'include',
      });

      if (response.ok) {
          const data = await response.json();
          return data.data;
      }
      console.error('Failed to fetch current juzz info');
      return null;
  } catch (error) {
      console.error('Failed to fetch current juzz info', error);
      return null;
  }
};

// Add these to the export statement
export { 
  fetchStudents, 
  fetchAttendance, 
  fetchStudentProgress, 
  getProgress,
  getTodayProgress,    // new
  getWeeklyProgress,   // new
  getCurrentJuzzInfo   // new
};


