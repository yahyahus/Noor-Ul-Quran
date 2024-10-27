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

export { getAttendance, markAttendance };
