import React, { useState, useEffect } from 'react';
import { getStudents, addStudent } from './services/studentService';
import { getTeachers, addTeacher, deleteTeacher } from './services/teacherService';
import { getAllClasses, addClass } from './services/classServices';
import AdminLogin from './services/AdminLogin';
import axios from 'axios';

function App() {
    // Authentication State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    
    // All state variables together at the top
    const [activeTab, setActiveTab] = useState('students');
    const [students, setStudents] = useState([]);
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [teacherName, setTeacherName] = useState('');
    const [teacherEmail, setTeacherEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [password, setPassword] = useState('');
    const [classes, setClasses] = useState([]);
    const [className, setClassName] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [bulkClass, setBulkClass] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);

    // All useEffect hooks together
    useEffect(() => {
        if (token) {
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchStudents();
            fetchTeachers();
            fetchClasses();
        }
    }, [token]);

    useEffect(() => {
        if (selectedClass) {
            const filtered = students.filter(student => student.class === selectedClass);
            setFilteredStudents(filtered);
        } else {
            setFilteredStudents([]);
        }
    }, [selectedClass, students]);

    // Get unique classes from students array
    const uniqueClasses = [...new Set(students.map(student => student.class))];
    
    // Styles for tabs
    const tabStyle = {
        padding: '10px 20px',
        margin: '0 5px',
        cursor: 'pointer',
        backgroundColor: '#f0f0f0',
        border: 'none',
        borderRadius: '5px'
    };

    const activeTabStyle = {
        ...tabStyle,
        backgroundColor: '#007bff',
        color: 'white'
    };

    const containerStyle = {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto'
    };

    // Define ALL fetch functions
    const fetchStudents = async () => {
        try {
            const data = await getStudents();
            setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchTeachers = async () => {
        try {
            console.log('Fetching teachers with token:', localStorage.getItem('token')); // Debug log
            const data = await getTeachers();
            console.log('Received teachers data:', data);
            setTeachers(data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            if (error.response) {
                console.error('Error response:', error.response.data); // Debug log
            }
        }
    };

    const fetchClasses = async () => {
        try {
            const data = await getAllClasses();
            setClasses(data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const handleLogout = () => {
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    // Add this function to handle selecting all students
    const handleSelectAllStudents = () => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([]); // Deselect all
        } else {
            setSelectedStudents(filteredStudents.map(student => student._id)); // Select all
        }
    };

    // If not authenticated, show login
    if (!isAuthenticated) {
        return <AdminLogin setToken={setToken} />;
    }

    // Existing handler functions
    const handleAddStudent = async () => {
        try {
            // Split the names by newline and filter out empty lines
            const studentNames = name.split('\n').filter(name => name.trim());
            
            // Add each student separately
            for (const studentName of studentNames) {
                console.log('Sending student data:', { 
                    name: studentName.trim(), 
                    class: bulkClass
                });

                const newStudent = { 
                    name: studentName.trim(), 
                    class: bulkClass
                };
                
                await addStudent(newStudent);
            }

            // Refresh the list and clear form after all students are added
            fetchStudents();
            setName('');
            setBulkClass('');
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const handleAddTeacher = async () => {
        try {
            const newTeacher = { 
                name: teacherName, 
                email: teacherEmail, 
                subject,
                password
            };
            await addTeacher(newTeacher);
            fetchTeachers();
            // Clear form
            setTeacherName('');
            setTeacherEmail('');
            setSubject('');
            setPassword('');
        } catch (error) {
            console.error('Error adding teacher:', error);
        }
    };

    const handleAddClass = async () => {
        try {
            const newClass = {
                name: className,
                teacherId: selectedTeacher,
                students: selectedStudents
            };
            await addClass(newClass);
            fetchClasses();
            // Clear form
            setClassName('');
            setSelectedTeacher('');
            setSelectedStudents([]);
        } catch (error) {
            console.error('Error adding class:', error);
        }
    };

    const handleDeleteTeacher = async (teacherId) => {
        try {
            console.log('Attempting to delete teacher with ID:', teacherId); // Debug log
            await deleteTeacher(teacherId);
            // Refresh the teachers list after deletion
            fetchTeachers();
        } catch (error) {
            console.error('Error deleting teacher:', error);
            if (error.response) {
                console.error('Server response:', error.response.data);
            }
        }
    };

    return (
        <div style={containerStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>School Management System</h1>
                <button 
                    onClick={handleLogout}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </div>
            
            {/* Navigation Tabs */}
            <div style={{ marginBottom: '20px' }}>
                <button 
                    style={activeTab === 'students' ? activeTabStyle : tabStyle}
                    onClick={() => setActiveTab('students')}
                >
                    Students
                </button>
                <button 
                    style={activeTab === 'teachers' ? activeTabStyle : tabStyle}
                    onClick={() => setActiveTab('teachers')}
                >
                    Teachers
                </button>
                <button 
                    style={activeTab === 'classes' ? activeTabStyle : tabStyle}
                    onClick={() => setActiveTab('classes')}
                >
                    Classes
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'students' && (
                <div>
                    <h2>Add Students</h2>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ marginBottom: '10px' }}>
                            <input
                                type="text"
                                placeholder="Class Name"
                                value={bulkClass}
                                onChange={(e) => setBulkClass(e.target.value)}
                                style={{ marginRight: '10px', width: '200px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <textarea
                                placeholder="Enter student names (one per line)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                rows="10"
                                style={{ width: '100%', maxWidth: '400px' }}
                            />
                        </div>
                        <button 
                            onClick={handleAddStudent}
                            disabled={!name.trim() || !bulkClass.trim()}
                        >
                            Add Students
                        </button>
                    </div>
                    <h3>Students List</h3>
                    <ul>
                        {students.map((student) => (
                            <li key={student._id || student.studentId}>
                                {`${student.name} - ${student.class} - ID: ${student.studentId}`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'teachers' && (
                <div>
                    <h2>Add New Teacher</h2>
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            type="text"
                            placeholder="Teacher Name"
                            value={teacherName}
                            onChange={(e) => setTeacherName(e.target.value)}
                            style={{ marginRight: '10px', width: '200px' }}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={teacherEmail}
                            onChange={(e) => setTeacherEmail(e.target.value)}
                            style={{ marginRight: '10px', width: '200px' }}
                        />
                        <input
                            type="text"
                            placeholder="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            style={{ marginRight: '10px', width: '200px' }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ marginRight: '10px', width: '200px' }}
                        />
                        <button onClick={handleAddTeacher}>Add Teacher</button>
                    </div>
                    <h3>Teachers List</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {teachers.map((teacher) => (
                            <li key={teacher._id} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: '10px',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}>
                                <span>{`${teacher.name} - ${teacher.subject || 'No subject assigned'}`}</span>
                                <button 
                                    onClick={() => handleDeleteTeacher(teacher._id)}
                                    style={{
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        padding: '5px 10px',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'classes' && (
                <div>
                    <h2>Add New Class</h2>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ marginBottom: '15px' }}>
                            <input
                                type="text"
                                placeholder="Class Name"
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                                style={{ marginRight: '10px', width: '200px' }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <select
                                value={selectedTeacher}
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                                style={{ marginRight: '10px', width: '200px' }}
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher._id} value={teacher._id}>
                                        {teacher.name} - {teacher.subject}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                style={{ marginRight: '10px', width: '200px' }}
                            >
                                <option value="">Select Student Class</option>
                                {uniqueClasses.map((className) => (
                                    <option key={className} value={className}>
                                        {className}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedClass && (
                            <div style={{ marginBottom: '15px' }}>
                                <button 
                                    onClick={handleSelectAllStudents}
                                    style={{ marginBottom: '10px' }}
                                >
                                    {selectedStudents.length === filteredStudents.length 
                                        ? 'Deselect All' 
                                        : 'Select All Students'}
                                </button>
                                <div style={{ 
                                    maxHeight: '200px', 
                                    overflowY: 'auto',
                                    border: '1px solid #ccc',
                                    padding: '10px'
                                }}>
                                    {filteredStudents.map((student) => (
                                        <div key={student._id} style={{ marginBottom: '5px' }}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(student._id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedStudents([...selectedStudents, student._id]);
                                                        } else {
                                                            setSelectedStudents(selectedStudents.filter(id => id !== student._id));
                                                        }
                                                    }}
                                                />
                                                {' '}{student.name} - {student.studentId}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={handleAddClass}
                            disabled={!className || !selectedTeacher || selectedStudents.length === 0}
                        >
                            Add Class
                        </button>
                    </div>

                    <h3>Classes List</h3>
                    <ul>
                        {classes.map((classItem) => (
                            <li key={classItem._id}>
                                {`${classItem.name} - Teacher: ${classItem.teacher?.name || 'Not assigned'}`}
                                <br />
                                {`Students: ${classItem.students?.length || 0}`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;
