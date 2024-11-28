const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Import Student model

// Add a new student
router.post('/add', async (req, res) => {
    console.log('Received request body:', req.body);
    try {
        const { name, studentId, class: studentClass } = req.body;

        if (!name || !studentId) {
            return res.status(400).json({ message: 'Name and Student ID are required' });
        }

        const newStudent = new Student({
            name,
            studentId,
            class: studentClass,
        });

        await newStudent.save();
        res.status(201).json({ message: 'Student added successfully', student: newStudent });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// Get all students
router.get('/all', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
