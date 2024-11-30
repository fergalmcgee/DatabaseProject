const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');

mongoose.connect('mongodb://localhost:27017/school_management', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function updateTeachers() {
    try {
        // Update all teachers without a subject field
        const result = await Teacher.updateMany(
            { subject: { $exists: false } },
            { $set: { subject: 'Not assigned' } }
        );
        
        console.log('Updated teachers:', result);
        process.exit(0);
    } catch (error) {
        console.error('Error updating teachers:', error);
        process.exit(1);
    }
}

updateTeachers(); 