const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: String, required: true }, // Teacher's name or ID
    date: { type: Date, default: Date.now },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // References Student model
});

module.exports = mongoose.model('Comment', CommentSchema);
