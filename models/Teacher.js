const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // Hash this for security
    classes: [{ type: String }], // List of class IDs or names the teacher manages
    role: { type: String, default: 'teacher' }, // Can later support 'admin'
});

module.exports = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);
