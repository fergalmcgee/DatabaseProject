import axios from 'axios';

export const getTeachers = async () => {
    try {
        const response = await axios.get('/api/teachers');
        return response.data;
    } catch (error) {
        console.error('Error fetching teachers:', error);
        throw error;
    }
};

export const addTeacher = async (teacher) => {
    try {
        const response = await axios.post('/api/teachers/add', teacher, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding teacher:', error);
        throw error;
    }
}; 