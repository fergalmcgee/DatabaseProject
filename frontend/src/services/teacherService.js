import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api'  // Make sure this matches your backend port
});

// Modify the interceptor to always get the latest token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        const { token } = response.data;
        localStorage.setItem('token', token);  // Save token after successful login
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTeachers = async () => {
    try {
        const response = await api.get('/teachers');
        console.log('Teacher response:', response.data); // Debug log
        return response.data;
    } catch (error) {
        console.error('Teacher service error:', error); // Debug log
        throw error;
    }
};

export const addTeacher = async (teacherData) => {
    try {
        const response = await api.post('/teachers/add', teacherData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteTeacher = async (teacherId) => {
    try {
        console.log('Deleting teacher with ID:', teacherId); // Debug log
        const response = await api.delete(`/teachers/${teacherId}`);
        return response.data;
    } catch (error) {
        console.error('Delete request failed:', error.response?.data); // Debug log
        throw error;
    }
}; 