const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher'); // Import Teacher model
const bcrypt = require('bcrypt'); // Add this at the top

// Add a new teacher
router.post('/add', async (req, res) => {
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
            password: hashedPassword
        });

        await newTeacher.save();
        res.status(201).json({ message: 'Teacher added successfully', teacher: newTeacher });
    } catch (error) {
        console.error('Error adding teacher:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all teachers
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
