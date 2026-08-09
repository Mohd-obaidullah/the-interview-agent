const { generateNextQuestion, evaluateAnswer, generateFinalReport } = require('../services/geminiService');
const { resumeStorage } = require('./resumeController');
const InterviewTemplate = require('../models/InterviewTemplate');
const Interview = require('../models/Interview');

const generateAccessCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'INT-';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

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

    const accessCode = generateAccessCode();

    const newTemplate = new InterviewTemplate({
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
      questions: generatedQuestions
    });

    await newTemplate.save();

    res.status(201).json({
      message: 'Interview questions generated successfully for preview.',
      template: newTemplate
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const publishTemplate = async (req, res) => {
  try {
    const { accessCode } = req.body;
    const template = await InterviewTemplate.findOne({ accessCode });

    if (!template) {
      return res.status(404).json({ error: 'Interview template not found.' });
    }

    template.status = 'published';
    await template.save();

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

const getInterviewerTemplates = async (req, res) => {
  try {
    const templates = await InterviewTemplate.find(
      req.userRole === 'interviewer' ? {} : { interviewerId: req.userId }
    ).sort({ createdAt: -1 });

    const listWithStats = await Promise.all(templates.map(async t => {
      const attempts = await Interview.find({ 
        $or: [{ accessCode: t.accessCode }, { templateId: t._id }] 
      });
      return {
        ...t.toObject(),
        attemptsCount: attempts.length,
        completedCount: attempts.filter(a => a.status === 'completed').length,
        id: t._id // for frontend compatibility
      };
    }));

    res.json({ templates: listWithStats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTemplateByAccessCode = async (req, res) => {
  try {
    const code = (req.params.code || '').trim().toUpperCase();
    const template = await InterviewTemplate.findOne({ accessCode: code });

    if (!template || template.status !== 'published') {
      return res.status(404).json({ error: 'Published interview not found for this code.' });
    }

    const existingSubmission = await Interview.findOne({ 
      userId: req.userId, 
      accessCode: code, 
      status: 'completed' 
    });

    res.json({
      template,
      alreadyCompleted: !!existingSubmission,
      existingReport: existingSubmission ? existingSubmission.finalReport : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTemplateSubmissions = async (req, res) => {
  try {
    const { code } = req.params;
    const template = await InterviewTemplate.findOne({ accessCode: code });

    const filter = { accessCode: code };
    if (template) {
      filter.$or = [{ accessCode: code }, { templateId: template._id }];
      delete filter.accessCode;
    }

    const submissions = await Interview.find(filter).sort({ createdAt: -1 });

    res.json({
      totalAttempts: submissions.length,
      submissions: submissions.map(s => ({
        id: s._id,
        studentId: s.userId,
        studentName: s.studentName,
        status: s.status,
        overallScore: s.finalReport?.overallScore || 0,
        createdAt: s.createdAt,
        finalReport: s.finalReport,
        qnaList: s.qnaList
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createInterview = async (req, res) => {
  try {
    const { jobRole, experienceLevel, interviewType, difficulty, totalQuestions, accessCode } = req.body;
    
    let template = null;
    if (accessCode) {
      template = await InterviewTemplate.findOne({ accessCode: accessCode.toUpperCase() });
      
      const existing = await Interview.findOne({
        userId: req.userId, 
        accessCode: accessCode.toUpperCase(), 
        status: 'completed'
      });
      
      if (existing) {
        return res.status(400).json({
          error: 'You have already completed this interview.',
          alreadyCompleted: true,
          finalReport: existing.finalReport
        });
      }
    }

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

    const newInterview = new Interview({
      templateId: template ? template._id : null,
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
      finalReport: null
    });

    await newInterview.save();

    res.status(201).json({
      message: 'Interview session generated successfully',
      interview: {
        ...newInterview.toObject(),
        id: newInterview._id // for frontend compatibility
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { interviewId, candidateAnswer, answerType } = req.body;
    const session = await Interview.findById(interviewId);

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    const evaluation = await evaluateAnswer({
      question: session.currentQuestion?.question || '',
      candidateAnswer: candidateAnswer || 'Candidate provided a clear technical response.',
      jobRole: session.jobRole,
      experienceLevel: session.experienceLevel
    });

    const qnaEntry = {
      questionId: session.currentQuestionIndex + 1,
      question: session.currentQuestion?.question || '',
      category: session.currentQuestion?.category || 'Technical',
      difficulty: session.currentQuestion?.difficulty || 'Medium',
      candidateAnswer: candidateAnswer || '',
      answerType: answerType || 'text',
      evaluation,
      answeredAt: new Date()
    };

    session.qnaList.push(qnaEntry);
    session.currentQuestionIndex += 1;

    if (session.currentQuestionIndex >= session.totalQuestionsCount) {
      session.status = 'completed';
      session.finalReport = await generateFinalReport(session);
      await session.save();
      return res.json({
        completed: true,
        message: 'Interview completed successfully!',
        lastEvaluation: evaluation,
        finalReport: session.finalReport,
        qnaList: session.qnaList
      });
    }

    let nextQuestion;
    const template = session.accessCode ? await InterviewTemplate.findOne({ accessCode: session.accessCode }) : null;

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
    await session.save();

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
    const session = await Interview.findById(interviewId);

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    session.status = 'completed';
    session.finalReport = await generateFinalReport(session);
    await session.save();

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
    const session = await Interview.findById(req.params.id);
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
    const list = await Interview.find({ userId: req.userId }).sort({ createdAt: -1 });
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
  getInterviewHistory
};
