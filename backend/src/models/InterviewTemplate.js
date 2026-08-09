const mongoose = require('mongoose');

const InterviewTemplateSchema = new mongoose.Schema({
  interviewerId: { type: String, required: true },
  interviewerName: { type: String, required: true },
  title: { type: String, required: true },
  jobRole: { type: String, required: true },
  skills: [{ type: String }],
  difficulty: { type: String, default: 'Medium' },
  totalQuestionsCount: { type: Number, default: 10 },
  timeLimitMinutes: { type: Number, default: 30 },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  accessCode: { type: String, required: true, unique: true },
  questions: [
    {
      questionId: Number,
      question: String,
      category: String,
      difficulty: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InterviewTemplate', InterviewTemplateSchema);
