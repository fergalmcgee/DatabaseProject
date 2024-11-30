const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Add a new student
router.post('/add', async (req, res) => {
    try {
        const { name, class: className } = req.body;

        // Generate a unique student ID (you can modify this format)
        const studentCount = await Student.countDocuments();
        const studentId = `ST${String(studentCount + 1).padStart(4, '0')}`;

        const newStudent = new Student({
            name,
            studentId,
            class: className
        });

        await newStudent.save();
        res.status(201).json({ message: 'Student added successfully', student: newStudent });
    } catch (error) {
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
