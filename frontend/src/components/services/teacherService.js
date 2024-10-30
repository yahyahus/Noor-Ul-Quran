const getAttendance = async (month, year) => {

    try {
        const response = await fetch(`http://localhost:5000/teacher/get-attendance?month=${month}&year=${year}`, {
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
        const response = await fetch('http://localhost:5000/teacher/mark-attendance', {
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

const markSabaq = async (studentId, date) => {
    try {
        const response = await fetch('http://localhost:5000/teacher/mark-sabaq', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentId, date }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Sabaq marked successfully:', data);
            return data;
        } else {
            console.error('Failed to mark sabaq');
            return { message: 'Failed to mark sabaq' };
        }
    }
    catch (error) {
        console.error('Failed to mark sabaq', error);
        return { message: 'Failed to mark sabaq' };
    }
};

const markSabqi = async (studentId, date) => {
    try {
        const response = await fetch('http://localhost:5000/teacher/mark-sabqi', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentId, date }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Sabqi marked successfully:', data);
            return data;
        } else {
            console.error('Failed to mark sabqi');
            return { message: 'Failed to mark sabqi' };
        }
    }
    catch (error) {
        console.error('Failed to mark sabqi', error);
        return { message: 'Failed to mark sabqi' };
    }
};

const markManzil = async (studentId, date) => {
    try {
        const response = await fetch('http://localhost:5000/teacher/mark-manzil', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentId, date }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Manzil marked successfully:', data);
            return data;
        } else {
            console.error('Failed to mark manzil');
            return { message: 'Failed to mark manzil' };
        }
    }
    catch (error) {
        console.error('Failed to mark manzil', error);
        return { message: 'Failed to mark manzil' };
    }
};

const getProgress = async (month, year) => {
    try {
        const response = await fetch(`http://localhost:5000/teacher/get-progress?month=${month}&year=${year}`, {
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



export { getAttendance, markAttendance , markSabaq, markSabqi, markManzil, getProgress };
