import React from 'react';

function LoginSelection({ setUserType }) {
    return (
        <div style={{ 
            maxWidth: '400px', 
            margin: '40px auto', 
            padding: '20px',
            textAlign: 'center',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Login Selection</h2>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <button 
                    onClick={() => setUserType('admin')}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        transition: 'background-color 0.3s'
                    }}
                >
                    Admin Login
                </button>
                <button 
                    onClick={() => setUserType('teacher')}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        transition: 'background-color 0.3s'
                    }}
                >
                    Teacher Login
                </button>
            </div>
        </div>
    );
}

export default LoginSelection;
