const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const path = require('path');
const serveStatic = require('serve-static');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:5000' })); // Allow requests from frontend
app.use(express.json());

// Serve static files from the React frontend build
app.use(serveStatic(path.join(__dirname, 'public')));

// Fallback to index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize default users if they don't exist
const initializeUsers = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await new User({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        profile: { email: 'admin@edutask.com' },
      }).save();
      console.log('Admin user created');
    }

    const studentExists = await User.findOne({ username: 'student1' });
    if (!studentExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('pass123', salt);
      await new User({
        username: 'student1',
        password: hashedPassword,
        role: 'student',
        profile: { email: 'student1@edutask.com' },
      }).save();
      console.log('Student1 user created');
    }
  } catch (error) {
    console.error('Error initializing users:', error);
  }
};

// Run initialization
initializeUsers();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/assignment', require('./routes/assignment'));
app.use('/api/submission', require('./routes/submission'));
app.use('/api/user', require('./routes/user'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});