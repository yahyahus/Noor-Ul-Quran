const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAttendance = async (month, year) => {

    try {
        const response = await fetch(`${API_BASE_URL}/teacher/get-attendance?month=${month}&year=${year}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Failed to fetch attendance');
            return [];
        }
    } catch (error) {
        console.error('Failed to fetch attendance', error);
        return [];
    }
};

const markAttendance = async (studentId, date, status) => {
    try {
        console.log('Marking attendance:', studentId, date, status);
        const response = await fetch(`${API_BASE_URL}/teacher/mark-attendance`, {
        method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentId, date, status }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Attendance marked successfully:', data);
            return data;
        } else {
            console.error('Failed to mark attendance');
            return { message: 'Failed to mark attendance' };
        }
    } catch (error) {
        console.error('Failed to mark attendance', error);
        return { message: 'Failed to mark attendance' };
    }
};

const markSabaq = async (studentId, date, sabaqDetails) => {
    try {
        const response = await fetch(`${API_BASE_URL}/teacher/mark-sabaq`, {
        method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                studentId,
                date,
                sabaq: sabaqDetails, // Include all sabaq fields (completed, numberOfLines, etc.)
            }),

        });

        if (response.ok) {
            console.log('Marking sabaq:', studentId, date, sabaqDetails);
            const data = await response.json();
            console.log('Sabaq marked successfully:', data);
            return data;
        } else {
            console.error('Failed to mark sabaq');
            return { message: 'Failed to mark sabaq' };
        }
    } catch (error) {
        console.error('Failed to mark sabaq', error);
        return { message: 'Failed to mark sabaq' };
    }
};

const markSabqi = async (studentId, date, sabqiDetails) => {
    try {
        const response = await fetch(`${API_BASE_URL}/teacher/mark-sabqi`, {
        method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                studentId,
                date,
                sabqi: sabqiDetails, // Include all sabqi fields (completed, juzz, quality, etc.)
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Sabqi marked successfully:', data);
            return data;
        } else {
            console.error('Failed to mark sabqi');
            return { message: 'Failed to mark sabqi' };
        }
    } catch (error) {
        console.error('Failed to mark sabqi', error);
        return { message: 'Failed to mark sabqi' };
    }
};


const markManzil = async (studentId, date, manzilDetails) => {
    try {
        //logging the manzil details
        console.log('Marking manzil:', studentId, date, manzilDetails);
        const response = await fetch(`${API_BASE_URL}/teacher/mark-manzil`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                studentId,
                date,
                manzil: manzilDetails, // Include all manzil fields (completed, juzz, quality, etc.)
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Manzil marked successfully:', data);
            return data;
        } else {
            console.error('Failed to mark manzil');
            return { message: 'Failed to mark manzil' };
        }
    } catch (error) {
        console.error('Failed to mark manzil', error);
        return { message: 'Failed to mark manzil' };
    }
};


const getProgress = async (month, year) => {
    try {
        const response = await fetch(`${API_BASE_URL}/teacher/get-progress?month=${month}&year=${year}`, {   
        method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Monthly progress fetched successfully:', data);
            return data;
        } else {
            console.error('Failed to fetch monthly progress');
            return { students: [] }; // Return an empty array if fetching fails
        }
    } catch (error) {
        console.error('Failed to fetch monthly progress', error);
        return { students: [] }; // Return an empty array in case of an error
    }
};

const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/dashboard-stats`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Failed to fetch dashboard stats');
      return {
        name: "Unknown Teacher",
        totalStudents: 0,
        pendingSabaq: 0,
        topPerformer: {
          name: "No data available",
          sabaqLines: 0,
          sabqiCompleted: false,
          manzilRating: 0
        }
      };
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats', error);
    return {
      name: "Unknown Teacher",
      totalStudents: 0,
      pendingSabaq: 0,
      topPerformer: {
        name: "No data available",
        sabaqLines: 0,
        sabqiCompleted: false,
        manzilRating: 0
      }
    };
  }
};

const getTodayStudentProgress = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/today-progress`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Failed to fetch today\'s student progress');
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch today\'s student progress', error);
    return [];
  }
};

export { 
  getAttendance, 
  markAttendance, 
  markSabaq, 
  markSabqi, 
  markManzil, 
  getProgress,
  getDashboardStats,
  getTodayStudentProgress
};
