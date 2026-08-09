const mongoose = require('mongoose');

const QnASchema = new mongoose.Schema({
  questionId: Number,
  question: String,
  category: String,
  difficulty: String,
  candidateAnswer: String,
  answerType: { type: String, enum: ['voice', 'text'], default: 'text' },
  evaluation: mongoose.Schema.Types.Mixed, // Storing raw evaluation for flexibility
  answeredAt: Date
});

const InterviewSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewTemplate' },
  interviewerId: { type: String }, // Recruiter who owns the interview
  userId: { type: String, required: true }, // Student ID
  studentName: { type: String, required: true },
  jobRole: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  interviewType: { type: String, required: true },
  difficulty: { type: String, required: true },
  totalQuestionsCount: { type: Number, default: 10 },
  currentQuestionIndex: { type: Number, default: 0 },
  status: { type: String, enum: ['in-progress', 'completed', 'paused'], default: 'in-progress' },
  accessCode: { type: String },
  qnaList: [QnASchema],
  finalReport: {
    overallScore: Number,
    summary: String,
    strengths: [String],
    weaknesses: [String],
    majorMistakes: [String],
    minorMistakes: [String],
    questionResults: [
      {
        question: String,
        answer: String,
        score: Number,
        correctness: Number,
        relevance: Number,
        technicalAccuracy: Number,
        completeness: Number,
        feedback: String,
        mistakes: [String],
        improvedAnswer: String
      }
    ],
    recommendation: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', InterviewSchema);
