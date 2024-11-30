import React from 'react';
import axios from 'axios';

const AdminLogin = ({ setToken }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        
        console.log('Attempting login with:', { username }); // Debug log
        
        try {
            const response = await axios.post('http://192.168.71.54:5001/api/auth/login', {
                username,
                password
            });
            
            console.log('Login response:', response.data); // Add this debug log
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userType', 'admin');
                setToken(response.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            } else {
                throw new Error('No token received');
            }
        } catch (error) {
            console.error('Login error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            alert(`Login failed: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div style={{ 
            maxWidth: '300px', 
            margin: '50px auto', 
            padding: '20px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            borderRadius: '5px'
        }}>
            <h2 style={{ textAlign: 'center' }}>Admin Login</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                    style={{ padding: '8px', fontSize: '16px' }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    style={{ padding: '8px', fontSize: '16px' }}
                />
                <button 
                    type="submit"
                    style={{
                        padding: '10px',
                        fontSize: '16px',
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
};

export default AdminLogin;
