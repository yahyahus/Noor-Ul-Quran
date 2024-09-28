const fetchUnassignedStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/unassigned-students', {
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

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/get-teachers', {
        method: 'GET',
        credentials: 'include',
      });
  
      if (response.ok) 
      {
        const data = await response.json();
        return data; 
      } else {
        console.error('Failed to fetch teachers');
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch teachers', error);
      return [];
    }
    }
 const assignStudent = async (studentId, teacherId) => {
    try {
      const response = await fetch('http://localhost:5000/admin/assign-student', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId, teacherId }),
      });
  
      return response;
    } catch (error) {
      console.error('Failed to assign student', error);
      return { ok: false };
    }
    

};


    export { fetchUnassignedStudents, fetchTeachers, assignStudent};