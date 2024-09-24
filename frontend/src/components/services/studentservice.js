// services/studentservice.js
const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/teacher/get-students', {
        method: 'GET',
        credentials: 'include',
      });
  
      if (response.ok) {
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
  
  export { fetchStudents };
  