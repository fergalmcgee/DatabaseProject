const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    subject: { type: String },
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    role: { type: String, default: 'teacher' }
});

module.exports = mongoose.model('Teacher', teacherSchema);
