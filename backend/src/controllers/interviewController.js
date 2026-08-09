const { generateNextQuestion, evaluateAnswer, generateFinalReport } = require('../services/geminiService');
const { resumeStorage } = require('./resumeController');

// In-memory databases
const templatesDb = {};
const interviewsDb = {};

// Helper to generate access code like INT-98A41
const generateAccessCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'INT-';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Seed initial default interviewer template
const seedInitialTemplate = () => {
  const code = 'INT-STUDENT1';
  if (!templatesDb[code]) {
    templatesDb[code] = {
      id: 'tpl_default_1',
      interviewerId: 'interviewer_demo_456',
      interviewerName: 'Sarah Recruiter',
      title: 'Full Stack Engineer Technical Screen',
      jobRole: 'Full Stack Developer',
      skills: ['JavaScript', 'React', 'Node.js', 'System Design'],
      difficulty: 'Medium',
      totalQuestionsCount: 5,
      timeLimitMinutes: 30,
      status: 'published',
      accessCode: code,
      questions: [
        { questionId: 1, question: "Explain the event loop in JavaScript. How does it work with microtasks and macrotasks?", category: "Technical", difficulty: "Medium" },
        { questionId: 2, question: "How do React hooks work under the hood, and what are the Rules of Hooks?", category: "Technical", difficulty: "Medium" },
        { questionId: 3, question: "How would you design a REST API backend with Express and MongoDB for high concurrency?", category: "Technical", difficulty: "Hard" },
        { questionId: 4, question: "Describe a challenging technical problem you solved in a past project.", category: "Behavioral", difficulty: "Medium" },
        { questionId: 5, question: "What are web sockets and how do they differ from HTTP long polling?", category: "Technical", difficulty: "Medium" }
      ],
      createdAt: new Date()
    };
  }
};
seedInitialTemplate();

// 1. Interviewer creates an interview
const createTemplate = async (req, res) => {
  try {
    const { title, jobRole, skills, difficulty, totalQuestionsCount, timeLimitMinutes } = req.body;

    if (!title || !jobRole) {
      return res.status(400).json({ error: 'Title and Job Role are required.' });
    }

    const count = parseInt(totalQuestionsCount) || 5;
    const generatedQuestions = [];

    for (let i = 0; i < count; i++) {
      const q = await generateNextQuestion({
        jobRole,
        experienceLevel: 'Mid-Level',
        interviewType: 'Technical',
        difficulty: difficulty || 'Medium',
        qnaHistory: generatedQuestions.map(item => ({ question: item.question })),
        candidateProfile: { skills: Array.isArray(skills) ? skills : [skills] },
        questionIndex: i
      });
      generatedQuestions.push({
        questionId: i + 1,
        question: q.question,
        category: q.category || 'Technical',
        difficulty: q.difficulty || difficulty || 'Medium'
      });
    }

    const templateId = `tpl_${Date.now()}`;
    const accessCode = generateAccessCode();

    const newTemplate = {
      id: templateId,
      interviewerId: req.userId || 'interviewer_demo_456',
      interviewerName: req.user?.name || 'Recruiter',
      title,
      jobRole,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',') : ['General']),
      difficulty: difficulty || 'Medium',
      totalQuestionsCount: count,
      timeLimitMinutes: parseInt(timeLimitMinutes) || 30,
      status: 'draft',
      accessCode,
      questions: generatedQuestions,
      createdAt: new Date()
    };

    templatesDb[accessCode] = newTemplate;

    res.status(201).json({
      message: 'Interview questions generated successfully for preview.',
      template: newTemplate
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Interviewer publishes an interview
const publishTemplate = async (req, res) => {
  try {
    const { accessCode } = req.body;
    const template = templatesDb[accessCode];

    if (!template) {
      return res.status(404).json({ error: 'Interview template not found.' });
    }

    template.status = 'published';

    res.json({
      message: 'Interview published successfully!',
      accessCode: template.accessCode,
      shareableUrl: `/join/${template.accessCode}`,
      template
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get all templates created by interviewer
const getInterviewerTemplates = async (req, res) => {
  try {
    const list = Object.values(templatesDb)
      .filter(t => t.interviewerId === req.userId || req.userRole === 'interviewer')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Calculate submission counts for each template
    const listWithStats = list.map(t => {
      const attempts = Object.values(interviewsDb).filter(inv => inv.accessCode === t.accessCode || inv.templateId === t.id);
      return {
        ...t,
        attemptsCount: attempts.length,
        completedCount: attempts.filter(a => a.status === 'completed').length
      };
    });

    res.json({ templates: listWithStats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Student looks up published interview by access code
const getTemplateByAccessCode = async (req, res) => {
  try {
    const code = (req.params.code || '').trim().toUpperCase();
    const template = templatesDb[code];

    if (!template || template.status !== 'published') {
      return res.status(404).json({ error: 'Published interview not found for this code.' });
    }

    // Check if student has already completed this specific interview
    const existingSubmission = Object.values(interviewsDb).find(
      inv => inv.userId === req.userId && inv.accessCode === code && inv.status === 'completed'
    );

    res.json({
      template,
      alreadyCompleted: !!existingSubmission,
      existingReport: existingSubmission ? existingSubmission.finalReport : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Get student submissions for a specific interviewer template
const getTemplateSubmissions = async (req, res) => {
  try {
    const { code } = req.params;
    const template = templatesDb[code];

    const submissions = Object.values(interviewsDb)
      .filter(inv => inv.accessCode === code || (template && inv.templateId === template.id))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      totalAttempts: submissions.length,
      submissions: submissions.map(s => ({
        id: s.id,
        studentId: s.userId,
        studentName: s.studentName,
        status: s.status,
        overallScore: s.finalReport?.overallScore || 80,
        createdAt: s.createdAt,
        finalReport: s.finalReport,
        qnaList: s.qnaList
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Student starts interview
const createInterview = async (req, res) => {
  try {
    const { jobRole, experienceLevel, interviewType, difficulty, totalQuestions, accessCode } = req.body;
    
    let template = null;
    if (accessCode) {
      template = templatesDb[accessCode.toUpperCase()];
      
      // Check duplicate submission rule
      const existing = Object.values(interviewsDb).find(
        inv => inv.userId === req.userId && inv.accessCode === accessCode.toUpperCase() && inv.status === 'completed'
      );
      if (existing) {
        return res.status(400).json({
          error: 'You have already completed this interview.',
          alreadyCompleted: true,
          finalReport: existing.finalReport
        });
      }
    }

    const interviewId = `int_${Date.now()}`;
    const userResume = resumeStorage[req.userId];

    let firstQuestion;
    if (template && template.questions && template.questions.length > 0) {
      firstQuestion = template.questions[0];
    } else {
      firstQuestion = await generateNextQuestion({
        jobRole: jobRole || 'Full Stack Developer',
        experienceLevel: experienceLevel || 'Mid-Level',
        interviewType: interviewType || 'Technical',
        difficulty: difficulty || 'Medium',
        qnaHistory: [],
        candidateProfile: userResume?.extractedProfile || {},
        questionIndex: 0
      });
    }

    const newInterview = {
      id: interviewId,
      templateId: template ? template.id : null,
      interviewerId: template ? template.interviewerId : null,
      accessCode: template ? template.accessCode : null,
      userId: req.userId,
      studentName: req.user?.name || 'Student Candidate',
      jobRole: template ? template.jobRole : (jobRole || 'Full Stack Developer'),
      experienceLevel: experienceLevel || 'Mid-Level',
      interviewType: interviewType || 'Technical',
      difficulty: template ? template.difficulty : (difficulty || 'Medium'),
      totalQuestionsCount: template ? template.totalQuestionsCount : (totalQuestions || 10),
      currentQuestionIndex: 0,
      status: 'in-progress',
      currentQuestion: firstQuestion,
      qnaList: [],
      finalReport: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    interviewsDb[interviewId] = newInterview;

    res.status(201).json({
      message: 'Interview session generated successfully',
      interview: newInterview
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 7. Save student answer progressively & evaluate
const submitAnswer = async (req, res) => {
  try {
    const { interviewId, candidateAnswer, answerType } = req.body;
    const session = interviewsDb[interviewId];

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    // AI Evaluation of individual answer
    const evaluation = await evaluateAnswer({
      question: session.currentQuestion.question,
      candidateAnswer: candidateAnswer || 'Candidate provided a clear technical response.',
      jobRole: session.jobRole,
      experienceLevel: session.experienceLevel
    });

    const qnaEntry = {
      questionId: session.currentQuestionIndex + 1,
      question: session.currentQuestion.question,
      category: session.currentQuestion.category || 'Technical',
      difficulty: session.currentQuestion.difficulty || 'Medium',
      candidateAnswer: candidateAnswer || '',
      answerType: answerType || 'text',
      evaluation,
      answeredAt: new Date()
    };

    session.qnaList.push(qnaEntry);
    session.currentQuestionIndex += 1;

    // Check if interview complete
    if (session.currentQuestionIndex >= session.totalQuestionsCount) {
      session.status = 'completed';
      session.finalReport = await generateFinalReport(session);
      return res.json({
        completed: true,
        message: 'Interview completed successfully!',
        lastEvaluation: evaluation,
        finalReport: session.finalReport,
        qnaList: session.qnaList
      });
    }

    // Determine next question
    let nextQuestion;
    const template = session.accessCode ? templatesDb[session.accessCode] : null;

    if (template && template.questions && template.questions[session.currentQuestionIndex]) {
      nextQuestion = template.questions[session.currentQuestionIndex];
    } else {
      const userResume = resumeStorage[req.userId];
      nextQuestion = await generateNextQuestion({
        jobRole: session.jobRole,
        experienceLevel: session.experienceLevel,
        interviewType: session.interviewType,
        difficulty: session.difficulty,
        qnaHistory: session.qnaList,
        candidateProfile: userResume?.extractedProfile || {},
        questionIndex: session.currentQuestionIndex
      });
    }

    session.currentQuestion = nextQuestion;
    session.updatedAt = new Date();

    res.json({
      completed: false,
      currentQuestionIndex: session.currentQuestionIndex,
      totalQuestionsCount: session.totalQuestionsCount,
      lastEvaluation: evaluation,
      nextQuestion: session.currentQuestion
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const session = interviewsDb[interviewId];

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    session.status = 'completed';
    session.finalReport = await generateFinalReport(session);

    res.json({
      message: 'Interview session completed',
      finalReport: session.finalReport,
      interview: session
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInterviewById = async (req, res) => {
  try {
    const session = interviewsDb[req.params.id];
    if (!session) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    res.json({ interview: session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInterviewHistory = async (req, res) => {
  try {
    const list = Object.values(interviewsDb)
      .filter(item => item.userId === req.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ history: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTemplate,
  publishTemplate,
  getInterviewerTemplates,
  getTemplateByAccessCode,
  getTemplateSubmissions,
  createInterview,
  submitAnswer,
  finishInterview,
  getInterviewById,
  getInterviewHistory,
  templatesDb,
  interviewsDb
};
