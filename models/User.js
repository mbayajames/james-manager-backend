const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], required: true },
  profile: {
    email: { type: String, required: true },
  },
});

module.exports = mongoose.model('User', userSchema);