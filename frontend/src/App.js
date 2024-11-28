import React, { useState, useEffect } from 'react';
import { getStudents, addStudent } from './services/studentService';
import { getTeachers, addTeacher } from './services/teacherService';
import { getAllClasses, addClass } from './services/classServices';
import { addComment, getStudentComments } from './services/commentService';

function App() {
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
    const [selectedStudentForComment, setSelectedStudentForComment] = useState('');
    const [commentText, setCommentText] = useState('');
    const [studentComments, setStudentComments] = useState({});

    useEffect(() => {
        fetchStudents();
        fetchTeachers();
        fetchClasses();
    }, []);

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
            const data = await getTeachers();
            setTeachers(data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
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

    const handleAddStudent = async () => {
        try {
            const newStudent = { name, studentId, class: studentClass };
            await addStudent(newStudent);
            fetchStudents();
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
            setClassName('');
            setSelectedTeacher('');
            setSelectedStudents([]);
        } catch (error) {
            console.error('Error adding class:', error);
        }
    };

    const fetchStudentComments = async (studentId) => {
        try {
            const comments = await getStudentComments(studentId);
            setStudentComments(prev => ({
                ...prev,
                [studentId]: comments
            }));
        } catch (error) {
            console.error('Error fetching student comments:', error);
        }
    };

    const handleAddComment = async () => {
        try {
            if (!selectedStudentForComment || !commentText) {
                alert('Please select a student and enter a comment');
                return;
            }

            const newComment = {
                text: commentText,
                author: selectedTeacher || 'Unknown Teacher',
                studentId: selectedStudentForComment
            };

            await addComment(newComment);
            await fetchStudentComments(selectedStudentForComment);
            setCommentText('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div>
            <h1>Student Management</h1>
            <div>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Class"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                />
                <button onClick={handleAddStudent}>Add Student</button>
            </div>
            <h2>Students List</h2>
            <ul>
                {students.map((student) => (
                    <li key={student.studentId}>{`${student.name} - ${student.class}`}</li>
                ))}
            </ul>
            <h1>Teacher Management</h1>
            <div>
                <input
                    type="text"
                    placeholder="Teacher Name"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleAddTeacher}>Add Teacher</button>
            </div>
            <h2>Teachers List</h2>
            <ul>
                {teachers.map((teacher) => (
                    <li key={teacher.teacherId}>{`${teacher.name} - ${teacher.subject}`}</li>
                ))}
            </ul>
            <h1>Class Management</h1>
            <div>
                <input
                    type="text"
                    placeholder="Class Name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                />
                <select
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                            {teacher.name}
                        </option>
                    ))}
                </select>
                <select
                    multiple
                    value={selectedStudents}
                    onChange={(e) => setSelectedStudents(
                        Array.from(e.target.selectedOptions, option => option.value)
                    )}
                >
                    {students.map((student) => (
                        <option key={student._id} value={student._id}>
                            {student.name}
                        </option>
                    ))}
                </select>
                <button onClick={handleAddClass}>Add Class</button>
            </div>
            <h2>Classes List</h2>
            <ul>
                {classes.map((classItem) => (
                    <li key={classItem._id}>
                        {`${classItem.name} - Teacher: ${classItem.teacher?.name || 'Not assigned'} - Students: ${classItem.students?.length || 0}`}
                    </li>
                ))}
            </ul>
            <h1>Comments Management</h1>
            <div>
                <select
                    value={selectedStudentForComment}
                    onChange={(e) => {
                        setSelectedStudentForComment(e.target.value);
                        fetchStudentComments(e.target.value);
                    }}
                >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                        <option key={student._id} value={student._id}>
                            {student.name}
                        </option>
                    ))}
                </select>
                <textarea
                    placeholder="Enter comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows="3"
                />
                <button onClick={handleAddComment}>Add Comment</button>
            </div>

            {selectedStudentForComment && (
                <div>
                    <h2>Comments for {students.find(s => s._id === selectedStudentForComment)?.name}</h2>
                    <ul>
                        {studentComments[selectedStudentForComment]?.map((comment) => (
                            <li key={comment._id}>
                                <p>{comment.text}</p>
                                <small>
                                    By {comment.author} on {new Date(comment.date).toLocaleDateString()}
                                </small>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;
