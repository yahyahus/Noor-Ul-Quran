const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getWorkingDays = async (month, year) => {
    try {
        const response = await fetch(`${API_BASE_URL}/get-working-days?month=${month}&year=${year}`, {
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
        const response = await fetch(`${API_BASE_URL}/fetch-juzz-names`, {
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