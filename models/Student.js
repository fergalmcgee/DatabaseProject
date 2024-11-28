const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    studentId: { type: String, unique: true, required: true },
    class: { type: String },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // References Comment model
});

module.exports = mongoose.model('Student', StudentSchema);
