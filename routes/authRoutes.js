const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/Teacher');

// Register Admin Route (one-time setup)
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can register users' });
        }

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ username, password, role });
        await newUser.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt received for:', username);

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        console.log('Stored password hash:', user.password);
        console.log('Attempting to match with:', password);
        
        const isMatch = await user.comparePassword(password);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Invalid credentials',
                debug: 'Password verification failed'
            });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Generated token:', token);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Server error during login',
            debug: error.message
        });
    }
});

router.post('/teacher/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);

        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            console.log('Teacher not found:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            console.log('Invalid password for:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { 
                id: teacher._id,
                role: 'teacher'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            teacher: {
                _id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                subject: teacher.subject
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
