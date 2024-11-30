import React, { useState } from 'react';
import axios from 'axios';

function TeacherLogin({ setTeacher, setIsAuthenticated }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Attempting login with:', { email }); // Debug log
            const response = await axios.post('http://192.168.71.54:5001/api/auth/teacher/login', {
                email,
                password
            });
            
            console.log('Login response:', response.data); // Debug log
            
            const { token, teacher } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userType', 'teacher');
            localStorage.setItem('teacherData', JSON.stringify(teacher));
            
            setTeacher(teacher);
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
            console.error('Login error:', error.response?.data || error);
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
            <h2>Teacher Login</h2>
            {error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
            )}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    style={{ 
                        width: '100%', 
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default TeacherLogin;
