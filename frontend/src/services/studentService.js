import axios from 'axios';

// Get all students
export const getStudents = async () => {
    try {
        const response = await axios.get('/api/students/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

// Add a new student
export const addStudent = async (student) => {
    try {
        console.log('Sending data to backend:', student); // Debug log
        const response = await axios.post('/api/students/add', JSON.stringify(student), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding student:', error.response?.data || error.message);
        throw error;
    }
};
