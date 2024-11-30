const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'teacher'] },
    createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        // Remove any whitespace from the candidate password
        const trimmedPassword = candidatePassword.trim();
        
        console.log('Comparing passwords:');
        console.log('Stored hash:', this.password);
        console.log('Candidate password (trimmed):', trimmedPassword);
        
        const isMatch = await bcrypt.compare(trimmedPassword, this.password);
        console.log('Password match result:', isMatch);
        
        return isMatch;
    } catch (error) {
        console.error('Password comparison error:', error);
        throw error;
    }
};

module.exports = mongoose.model('User', UserSchema);

