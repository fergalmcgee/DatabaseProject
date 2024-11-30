const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { authenticate } = require('../middleware/authMiddleware');

// Keep existing routes and add authentication middleware
router.post('/add', authenticate, async (req, res) => {
    try {
        console.log('Adding comment:', req.body); // Debug log
        const { text, author, studentId } = req.body;

        const newComment = new Comment({ 
            text, 
            author, 
            student: studentId,
            date: new Date()
        });
        
        await newComment.save();
        console.log('Comment saved:', newComment); // Debug log

        res.status(201).json({ 
            message: 'Comment added successfully', 
            comment: newComment 
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all comments for a student (add authentication)
router.get('/student/:studentId', authenticate, async (req, res) => {
    try {
        const { studentId } = req.params;
        console.log('Fetching comments for student:', studentId); // Debug log
        
        const comments = await Comment.find({ student: studentId })
            .sort({ date: -1 });
        
        console.log('Found comments:', comments); // Debug log
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
