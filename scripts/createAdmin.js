require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createAdminUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/school_management');
        
        // Delete existing admin user if exists
        await User.deleteOne({ username: 'admin' });

        const adminUser = new User({
            username: 'admin',
            password: 'admin123', // This will be hashed automatically
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser(); 