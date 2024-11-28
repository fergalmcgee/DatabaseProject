const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Class name (e.g., "Math 101")
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }, // Reference to a teacher
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // Array of student IDs
    createdAt: { type: Date, default: Date.now }, // Timestamp for when the class was created
});

module.exports = mongoose.model('Class', ClassSchema);

