import React, { useState, useEffect } from 'react';
import { getStudents, addStudent } from './services/studentService';
import { getTeachers, addTeacher, deleteTeacher } from './services/teacherService';
import { getAllClasses, addClass } from './services/classServices';
import AdminLogin from './services/AdminLogin';
import axios from 'axios';
import LoginSelection from './services/LoginSelection';
import TeacherLogin from './services/TeacherLogin';
import TeacherDashboard from './services/TeacherDashboard';

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
    const [userType, setUserType] = useState(localStorage.getItem('userType') || '');
    const [teacher, setTeacher] = useState(JSON.parse(localStorage.getItem('teacherData') || 'null'));

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
    
    // Updated styles
    const containerStyle = {
        padding: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#f8f9fa'
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const tabContainerStyle = {
        display: 'flex',
        gap: '2px',
        marginBottom: '20px',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const tabStyle = {
        padding: '12px 24px',
        backgroundColor: 'transparent',
        color: '#6c757d',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.3s ease'
    };

    const activeTabStyle = {
        ...tabStyle,
        backgroundColor: '#007bff',
        color: 'white'
    };

    const contentAreaStyle = {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    };

    const inputStyle = {
        width: '100%',
        padding: '8px 12px',
        marginBottom: '10px',
        border: '1px solid #ced4da',
        borderRadius: '4px',
        fontSize: '14px'
    };

    // Add these new style objects
    const cardContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px'
    };

    const cardStyle = {
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease'
    };

    const formGroupStyle = {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '20px'
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
            console.log('Fetching classes...'); // Debug log
            const data = await getAllClasses();
            console.log('Classes data:', data); // Debug log
            setClasses(data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const handleLogout = () => {
        setToken(null);
        setIsAuthenticated(false);
        setUserType('');
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('teacherData');
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

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            setIsAuthenticated(false);
            setUserType('');
            setToken(null);
        }
    }, []);

    // If not authenticated, show login selection first
    if (!isAuthenticated) {
        // Clear any leftover state when showing login selection
        if (!userType) {
            return <LoginSelection setUserType={setUserType} />;
        }
        if (userType === 'admin') {
            return <AdminLogin setToken={setToken} />;
        }
        if (userType === 'teacher') {
            return <TeacherLogin setTeacher={setTeacher} setIsAuthenticated={setIsAuthenticated} />;
        }
    }

    // Add teacher dashboard rendering
    if (isAuthenticated && userType === 'teacher') {
        return <TeacherDashboard teacher={teacher} />;
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
            <div style={headerStyle}>
                <h1 style={{ margin: 0, color: '#2c3e50' }}>School Management System</h1>
                <button 
                    onClick={handleLogout}
                    style={{
                        ...buttonStyle,
                        backgroundColor: '#dc3545'
                    }}
                    onMouseOver={e => e.target.style.backgroundColor = '#c82333'}
                    onMouseOut={e => e.target.style.backgroundColor = '#dc3545'}
                >
                    Logout
                </button>
            </div>

            <div style={tabContainerStyle}>
                {['Students', 'Teachers', 'Classes'].map(tab => (
                    <button
                        key={tab.toLowerCase()}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        style={activeTab === tab.toLowerCase() ? activeTabStyle : tabStyle}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div style={contentAreaStyle}>
                {/* Keep existing tab content but update their styling using the new style objects */}
                {activeTab === 'students' && (
                    <div>
                        <div style={formGroupStyle}>
                            <h2 style={{ color: '#2c3e50', marginTop: 0 }}>Add Students</h2>
                            <input
                                type="text"
                                placeholder="Class Name"
                                value={bulkClass}
                                onChange={(e) => setBulkClass(e.target.value)}
                                style={inputStyle}
                            />
                            <textarea
                                placeholder="Enter student names (one per line)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                rows="10"
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                            <button 
                                onClick={handleAddStudent}
                                disabled={!name.trim() || !bulkClass.trim()}
                                style={buttonStyle}
                            >
                                Add Students
                            </button>
                        </div>

                        <h3 style={{ color: '#2c3e50' }}>Students List</h3>
                        <div style={cardContainerStyle}>
                            {students.map((student) => (
                                <div key={student._id || student.studentId} style={cardStyle}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{student.name}</h4>
                                    <p style={{ margin: '0', color: '#6c757d' }}>Class: {student.class}</p>
                                    <p style={{ margin: '5px 0 0', color: '#6c757d' }}>ID: {student.studentId}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'teachers' && (
                    <div>
                        <div style={formGroupStyle}>
                            <h2 style={{ color: '#2c3e50', marginTop: 0 }}>Add New Teacher</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Teacher Name"
                                    value={teacherName}
                                    onChange={(e) => setTeacherName(e.target.value)}
                                    style={inputStyle}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={teacherEmail}
                                    onChange={(e) => setTeacherEmail(e.target.value)}
                                    style={inputStyle}
                                />
                                <input
                                    type="text"
                                    placeholder="Subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    style={inputStyle}
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <button onClick={handleAddTeacher} style={buttonStyle}>Add Teacher</button>
                        </div>

                        <h3 style={{ color: '#2c3e50' }}>Teachers List</h3>
                        <div style={cardContainerStyle}>
                            {teachers.map((teacher) => (
                                <div key={teacher._id} style={cardStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{teacher.name}</h4>
                                            <p style={{ margin: '0 0 5px', color: '#6c757d' }}>{teacher.email}</p>
                                            <p style={{ margin: '0', color: '#6c757d' }}>Subject: {teacher.subject}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteTeacher(teacher._id)}
                                            style={{
                                                ...buttonStyle,
                                                backgroundColor: '#dc3545',
                                                padding: '5px 10px',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'classes' && (
                    <div>
                        <div style={formGroupStyle}>
                            <h2 style={{ color: '#2c3e50', marginTop: 0 }}>Add New Class</h2>
                            <input
                                type="text"
                                placeholder="Class Name"
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                                style={inputStyle}
                            />
                            
                            <select
                                value={selectedTeacher}
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher._id} value={teacher._id}>
                                        {teacher.name} - {teacher.subject}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="">Select Student Class</option>
                                {uniqueClasses.map((className) => (
                                    <option key={className} value={className}>
                                        {className}
                                    </option>
                                ))}
                            </select>

                            {selectedClass && (
                                <div style={{ marginTop: '15px' }}>
                                    <button 
                                        onClick={handleSelectAllStudents}
                                        style={{
                                            ...buttonStyle,
                                            marginBottom: '10px',
                                            backgroundColor: '#6c757d'
                                        }}
                                    >
                                        {selectedStudents.length === filteredStudents.length 
                                            ? 'Deselect All' 
                                            : 'Select All Students'}
                                    </button>
                                    <div style={{ 
                                        maxHeight: '200px', 
                                        overflowY: 'auto',
                                        border: '1px solid #ced4da',
                                        borderRadius: '4px',
                                        padding: '10px'
                                    }}>
                                        {filteredStudents.map((student) => (
                                            <div key={student._id} style={{ marginBottom: '8px' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                                                    {student.name} - {student.studentId}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button 
                                onClick={handleAddClass}
                                disabled={!className || !selectedTeacher || selectedStudents.length === 0}
                                style={{
                                    ...buttonStyle,
                                    marginTop: '20px',
                                    opacity: (!className || !selectedTeacher || selectedStudents.length === 0) ? 0.5 : 1
                                }}
                            >
                                Add Class
                            </button>
                        </div>

                        <h3 style={{ color: '#2c3e50' }}>Classes List</h3>
                        <div style={cardContainerStyle}>
                            {classes.map((classItem) => (
                                <div key={classItem._id} style={cardStyle}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{classItem.name}</h4>
                                    <p style={{ margin: '0 0 5px', color: '#6c757d' }}>
                                        Teacher: {classItem.teacher?.name || 'Not assigned'}
                                    </p>
                                    <p style={{ margin: '0', color: '#6c757d' }}>
                                        Students: {classItem.students?.length || 0}
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

export default App;
