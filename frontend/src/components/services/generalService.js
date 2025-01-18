const getWorkingDays = async (month, year) => {
    try {
        const response = await fetch(`http://localhost:5000/get-working-days?month=${month}&year=${year}`, {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Failed to fetch working days');
            return [];
        }
    } catch (error) {
        console.error('Failed to fetch working days', error);
        return [];
    }
};

const fetchJuzzNames = async () => {
    try {
        const response = await fetch('http://localhost:5000/fetch-juzz-names', {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Failed to fetch juzz names');
            return [];
        }
    } catch (error) {
        console.error('Failed to fetch juzz names', error);
        return [];
    }
}

export { getWorkingDays , fetchJuzzNames };