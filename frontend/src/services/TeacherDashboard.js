import React, { useState, useEffect } from 'react';
import { getTeacherClasses, getClassStudents } from '../services/teacherService';
import { addComment, getStudentComments } from '../services/commentService';

function TeacherDashboard({ teacher }) {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');

    // Add this debug log at the start of the component
    useEffect(() => {
        console.log('Teacher data:', teacher); // Debug log
        
        const fetchTeacherClasses = async () => {
            try {
                if (teacher && teacher._id) {
                    console.log('Fetching classes for teacher ID:', teacher._id);
                    const teacherClasses = await getTeacherClasses(teacher._id);
                    console.log('Fetched classes:', teacherClasses);
                    setClasses(teacherClasses);
                }
            } catch (error) {
                console.error('Error fetching teacher classes:', error);
                setError('Failed to load classes');
            }
        };

        fetchTeacherClasses();
    }, [teacher]);

    // Fetch students when a class is selected
    useEffect(() => {
        if (selectedClass) {
            const fetchStudents = async () => {
                try {
                    const data = await getClassStudents(selectedClass);
                    setStudents(data);
                } catch (error) {
                    console.error('Error fetching students:', error);
                    setError('Failed to load students');
                }
            };
            fetchStudents();
        }
    }, [selectedClass]);

    // Fetch comments when a student is selected
    useEffect(() => {
        if (selectedStudent) {
            const fetchComments = async () => {
                try {
                    const data = await getStudentComments(selectedStudent._id);
                    setComments(data);
                } catch (error) {
                    console.error('Error fetching comments:', error);
                    setError('Failed to load comments');
                }
            };
            fetchComments();
        }
    }, [selectedStudent]);

    // Add these debug logs after your existing useEffects
    useEffect(() => {
        console.log('Current classes state:', classes);
        console.log('Current selectedClass state:', selectedClass);
        console.log('Current students state:', students);
    }, [classes, selectedClass, students]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const commentData = {
                text: newComment,
                author: teacher.name,
                studentId: selectedStudent._id
            };
            await addComment(commentData);
            
            // Refresh comments
            const updatedComments = await getStudentComments(selectedStudent._id);
            setComments(updatedComments);
            setNewComment('');
            setError('');
        } catch (error) {
            console.error('Error adding comment:', error);
            setError('Failed to add comment');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('teacherData');
        window.location.reload();
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <h2>Welcome, {teacher.name}</h2>
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

            {error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
            )}

            {/* Classes Section */}
            <div style={{ marginBottom: '20px' }}>
                <h3>Your Classes</h3>
                {classes.length === 0 ? (
                    <p>No classes assigned yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {classes.map(cls => (
                            <div 
                                key={cls._id}
                                onClick={() => setSelectedClass(cls._id)}
                                style={{
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedClass === cls._id ? '#e0e0e0' : 'white',
                                    minWidth: '150px'
                                }}
                            >
                                <h4 style={{ margin: '0' }}>{cls.name}</h4>
                                <small>{cls.students?.length || 0} students</small>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                {/* Student List */}
                <div style={{ width: '250px' }}>
                    <h3>Students</h3>
                    <div style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '4px',
                        maxHeight: '600px',
                        overflowY: 'auto'
                    }}>
                        {students.map(student => (
                            <div 
                                key={student._id}
                                onClick={() => setSelectedStudent(student)}
                                style={{
                                    padding: '10px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedStudent?._id === student._id ? '#e0e0e0' : 'white',
                                    borderBottom: '1px solid #ddd'
                                }}
                            >
                                <div>{student.name}</div>
                                <div style={{ fontSize: '0.8em', color: '#666' }}>
                                    ID: {student.studentId}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comments Section */}
                {selectedStudent && (
                    <div style={{ flex: 1 }}>
                        <h3>Comments for {selectedStudent.name}</h3>
                        
                        {/* New Comment Input */}
                        <div style={{ marginBottom: '20px' }}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    minHeight: '100px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                            />
                            <button 
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Add Comment
                            </button>
                        </div>

                        {/* Comments Feed */}
                        <div style={{ 
                            maxHeight: '500px', 
                            overflowY: 'auto',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            padding: '10px'
                        }}>
                            {comments.map(comment => (
                                <div 
                                    key={comment._id}
                                    style={{
                                        padding: '15px',
                                        marginBottom: '10px',
                                        backgroundColor: 'white',
                                        borderRadius: '4px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                        {comment.author}
                                    </div>
                                    <div style={{ marginBottom: '5px' }}>
                                        {comment.text}
                                    </div>
                                    <div style={{ fontSize: '0.8em', color: '#666' }}>
                                        {new Date(comment.date).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TeacherDashboard;
