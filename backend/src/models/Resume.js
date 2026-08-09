const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: { type: String, required: true },
  rawText: { type: String, required: true },
  extractedProfile: {
    skills: [String],
    technologies: [String],
    projects: [String],
    experience: [String],
    education: [String],
    achievements: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', ResumeSchema);
