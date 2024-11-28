const express = require('express');
const connectDB = require('./db/db'); // Import the MongoDB connection file

const app = express(); // Initialize the Express app

// Add this middleware before your routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const commentRoutes = require('./routes/commentRoutes');
const classRoutes = require('./routes/classRoutes');


// Use routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/classes', classRoutes);

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

