const express = require('express');
const router = express.Router();
const Class = require('../models/Class'); // Import Class model

// Add a new class
router.post('/add', async (req, res) => {
    try {
        const { name, teacherId, students } = req.body;

        const newClass = new Class({ name, teacher: teacherId, students });
        await newClass.save();

        res.status(201).json({ message: 'Class added successfully', class: newClass });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all classes
router.get('/all', async (req, res) => {
    try {
        const classes = await Class.find().populate('teacher').populate('students');
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
