const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'] 
    },
    studentId: { 
        type: String,
        unique: true
    },
    class: { 
        type: String, 
        required: [true, 'Class is required'] 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Add a pre-save hook to generate studentId if not provided
StudentSchema.pre('save', async function(next) {
    if (!this.studentId) {
        const studentCount = await this.constructor.countDocuments();
        this.studentId = `ST${String(studentCount + 1).padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Student', StudentSchema);
