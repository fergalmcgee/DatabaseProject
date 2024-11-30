const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    subject: { type: String },
    role: { type: String, default: 'teacher' },
    classes: [{ type: String }]
});

module.exports = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);
