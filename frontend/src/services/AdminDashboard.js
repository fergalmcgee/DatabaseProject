import React, { useState, useEffect } from 'react';
import { getStudents, addStudent } from '../services/studentService';
import { getTeachers, addTeacher, deleteTeacher } from '../services/teacherService';
import { getAllClasses, addClass } from '../services/classServices';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('students');
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [showAddStudent, setShowAddStudent] = useState(false);
    const [showAddTeacher, setShowAddTeacher] = useState(false);
    const [showAddClass, setShowAddClass] = useState(false);
    const [error, setError] = useState('');

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsData, teachersData, classesData] = await Promise.all([
                    getStudents(),
                    getTeachers(),
                    getAllClasses()
                ]);
                setStudents(studentsData);
                setTeachers(teachersData);
                setClasses(classesData);
            } catch (error) {
                setError('Failed to fetch data');
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <div style={{ 
            padding: '30px', 
            maxWidth: '1200px', 
            margin: '0 auto',
            backgroundColor: '#f8f9fa'
        }}>
            {/* Header */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '30px',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ margin: 0, color: '#2c3e50' }}>Admin Dashboard</h1>
                <button 
                    onClick={handleLogout}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={e => e.target.style.backgroundColor = '#c82333'}
                    onMouseOut={e => e.target.style.backgroundColor = '#dc3545'}
                >
                    Logout
                </button>
            </div>

            {/* Navigation Tabs */}
            <div style={{ 
                display: 'flex', 
                gap: '2px',
                marginBottom: '20px',
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                {['Students', 'Teachers', 'Classes'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: activeTab === tab.toLowerCase() ? '#007bff' : 'transparent',
                            color: activeTab === tab.toLowerCase() ? 'white' : '#6c757d',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div style={{ 
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                {/* Students Tab */}
                {activeTab === 'students' && (
                    <div>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <h2 style={{ margin: 0, color: '#2c3e50' }}>Students</h2>
                            <button 
                                onClick={() => setShowAddStudent(true)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Add Student
                            </button>
                        </div>
                        <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '20px'
                        }}>
                            {students.map(student => (
                                <div 
                                    key={student._id}
                                    style={{
                                        padding: '15px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                    onMouseOver={e => e.target.style.transform = 'translateY(-5px)'}
                                    onMouseOut={e => e.target.style.transform = 'translateY(0)'}
                                >
                                    <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{student.name}</h3>
                                    <p style={{ margin: '0', color: '#6c757d' }}>ID: {student.studentId}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Teachers Tab */}
                {activeTab === 'teachers' && (
                    <div>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <h2 style={{ margin: 0, color: '#2c3e50' }}>Teachers</h2>
                            <button 
                                onClick={() => setShowAddTeacher(true)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Add Teacher
                            </button>
                        </div>
                        <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '20px'
                        }}>
                            {teachers.map(teacher => (
                                <div 
                                    key={teacher._id}
                                    style={{
                                        padding: '15px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                >
                                    <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{teacher.name}</h3>
                                    <p style={{ margin: '0 0 5px 0', color: '#6c757d' }}>{teacher.email}</p>
                                    <p style={{ margin: '0', color: '#6c757d' }}>Subject: {teacher.subject}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Classes Tab */}
                {activeTab === 'classes' && (
                    <div>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <h2 style={{ margin: 0, color: '#2c3e50' }}>Classes</h2>
                            <button 
                                onClick={() => setShowAddClass(true)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Add Class
                            </button>
                        </div>
                        <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '20px'
                        }}>
                            {classes.map(cls => (
                                <div 
                                    key={cls._id}
                                    style={{
                                        padding: '15px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                >
                                    <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{cls.name}</h3>
                                    <p style={{ margin: '0 0 5px 0', color: '#6c757d' }}>
                                        Teacher: {cls.teacher?.name || 'Not assigned'}
                                    </p>
                                    <p style={{ margin: '0', color: '#6c757d' }}>
                                        Students: {cls.students?.length || 0}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
