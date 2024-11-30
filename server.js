require('dotenv').config(); // Load environment variables
const express = require('express');
const connectDB = require('./db/db'); // Import the MongoDB connection file
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express(); // Initialize the Express app

// Add this middleware before your routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const commentRoutes = require('./routes/commentRoutes');
const classRoutes = require('./routes/classRoutes');
const authRoutes = require('./routes/authRoutes'); // Import auth routes


// Use routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/auth', authRoutes); // Add auth routes

// Connect to the database
connectDB();

// Define a test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err.message });
});

