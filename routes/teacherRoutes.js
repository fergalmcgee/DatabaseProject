const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher'); // Import Teacher model
const bcrypt = require('bcrypt'); // Make sure this is imported!
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const Class = require('../models/Class'); // Import Class model

// Make sure all these routes are defined
router.get('/', authenticate, async (req, res) => {
    try {
        const teachers = await Teacher.find();
        console.log('Found teachers:', teachers);
        res.status(200).json(teachers);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/add', authenticate, authorizeAdmin, async (req, res) => {
    console.log('Received teacher data:', req.body); // Debug log
    try {
        const { name, email, subject, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newTeacher = new Teacher({
            name,
            email,
            subject,
            password: hashedPassword,
            role: 'teacher' // Explicitly set the role
        });

        await newTeacher.save();
        res.status(201).json({ message: 'Teacher added successfully', teacher: newTeacher });
    } catch (error) {
        console.error('Error adding teacher:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add this delete route
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const teacherId = req.params.id;
        console.log('Delete request for teacher:', teacherId); // Debug log
        console.log('User authorization:', req.user); // Debug log to check auth
        
        const result = await Teacher.findByIdAndDelete(teacherId);
        if (!result) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        
        res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get classes for a specific teacher
router.get('/:teacherId/classes', authenticate, async (req, res) => {
    try {
        const teacherId = req.params.teacherId;
        console.log('Fetching classes for teacher:', teacherId); // Debug log
        
        // Find all classes where teacher matches the teacherId
        const classes = await Class.find({ teacher: teacherId })
            .populate('students')
            .populate('teacher');
        
        console.log('Found classes:', classes); // Debug log
        
        if (!classes) {
            return res.status(404).json({ message: 'No classes found for this teacher' });
        }

        res.status(200).json(classes);
    } catch (error) {
        console.error('Error fetching teacher classes:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
