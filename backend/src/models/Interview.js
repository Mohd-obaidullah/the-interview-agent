const mongoose = require('mongoose');

const QnASchema = new mongoose.Schema({
  questionId: Number,
  question: String,
  category: String,
  difficulty: String,
  candidateAnswer: String,
  answerType: { type: String, enum: ['voice', 'text'], default: 'text' },
  evaluation: {
    technicalAccuracy: Number,
    relevance: Number,
    clarity: Number,
    communication: Number,
    confidence: Number,
    depthOfKnowledge: Number,
    problemSolving: Number,
    overallQuestionScore: Number,
    feedback: String,
    improvementHint: String
  },
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
  qnaList: [QnASchema],
  finalReport: {
    overallScore: Number,
    categoryScores: {
      technical: Number,
      communication: Number,
      confidence: Number,
      relevance: Number,
      depth: Number,
      problemSolving: Number
    },
    strengths: [String],
    weaknesses: [String],
    questionsToImprove: [{ question: String, issue: String }],
    detailedFeedback: String,
    recommendedTopics: [String],
    personalizedPlan: [String],
    readinessScore: Number
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', InterviewSchema);
