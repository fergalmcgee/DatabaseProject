import axios from 'axios';

const BASE_URL = '/api/students';

// Service to add a new student
export const addStudent = async (studentData) => {
    try {
        const response = await axios.post(`${BASE_URL}/add`, studentData);
        return response.data;
    } catch (error) {
        console.error('Error adding student:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Service to fetch all students
export const getStudents = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};
