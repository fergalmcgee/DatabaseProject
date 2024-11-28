const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment'); // Import Comment model

// Add a new comment
router.post('/add', async (req, res) => {
    try {
        const { text, author, studentId } = req.body;

        const newComment = new Comment({ text, author, student: studentId });
        await newComment.save();

        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all comments for a student
router.get('/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;

        const comments = await Comment.find({ student: studentId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
