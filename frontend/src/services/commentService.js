import axios from 'axios';

const BASE_URL = '/api/comments';

export const addComment = async (commentData) => {
    try {
        const response = await axios.post(`${BASE_URL}/add`, commentData);
        return response.data;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

export const getStudentComments = async (studentId) => {
    try {
        const response = await axios.get(`${BASE_URL}/student/${studentId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
}; 