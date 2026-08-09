const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'interviewer'], required: true },
  avatar: { type: String, default: '' },
  
  // Profile Awareness & Curriculum Tracking
  completedDays: [{ type: String }],
  skippedDays: [{ type: String }],
  attempts: { type: Number, default: 0 },
  learningSignals: [{
    topic: String,
    proficiency: { type: String, enum: ['Weak', 'Average', 'Strong'] },
    lastAssessed: Date
  }],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
