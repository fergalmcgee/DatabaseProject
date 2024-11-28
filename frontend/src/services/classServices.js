import axios from 'axios';

const BASE_URL = 'api/classes'; // Update to match your backend port

// Service to add a new class
export const addClass = async (classData) => {
    try {
        const response = await axios.post(`${BASE_URL}/add`, classData);
        return response.data;
    } catch (error) {
        console.error('Error adding class:', error);
        throw error;
    }
};

// Service to fetch all classes
export const getAllClasses = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw error;
    }
};
