const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const Class = require('../models/Class');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// Add a new class
router.post('/add', async (req, res) => {
    try {
        const { name, teacherId, students } = req.body;
        console.log('Adding class with teacher:', teacherId); // Debug log

        const newClass = new Class({ 
            name, 
            teacher: teacherId, 
            students 
        });
        
        await newClass.save();
        console.log('Class saved:', newClass); // Debug log

        // Update teacher's classes array if you're maintaining that reference
        await Teacher.findByIdAndUpdate(
            teacherId,
            { $push: { classes: newClass._id } }
        );

        res.status(201).json({ 
            message: 'Class added successfully', 
            class: newClass 
        });
    } catch (error) {
        console.error('Error adding class:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all classes
router.get('/all', async (req, res) => {
    try {
        console.log('Fetching all classes');
        const classes = await Class.find()
            .populate('teacher', 'name email subject')
            .populate('students', 'name studentId');
        
        console.log('Classes found:', classes);
        res.status(200).json(classes);
    } catch (error) {
        console.error('Error in /all route:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get students in a specific class
router.get('/:classId/students', authenticate, async (req, res) => {
    try {
        const classId = req.params.classId;
        console.log('Fetching students for class:', classId);
        
        const classData = await Class.findById(classId)
            .populate({
                path: 'students',
                select: 'name studentId' // Only select the fields we need
            });
        
        if (!classData) {
            return res.status(404).json({ message: 'Class not found' });
        }

        console.log('Found students:', classData.students);
        res.status(200).json(classData.students);
    } catch (error) {
        console.error('Error fetching class students:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
