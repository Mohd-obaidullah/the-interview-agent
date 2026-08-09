const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/interviewController');

// Interviewer endpoints
router.post('/template/create', authMiddleware, requireRole('interviewer'), createTemplate);
router.post('/template/publish', authMiddleware, requireRole('interviewer'), publishTemplate);
router.get('/template/my-interviews', authMiddleware, requireRole('interviewer'), getInterviewerTemplates);
router.get('/template/:code/submissions', authMiddleware, requireRole('interviewer'), getTemplateSubmissions);

// Shared / Student endpoints
router.get('/template/code/:code', authMiddleware, getTemplateByAccessCode);
router.post('/start', authMiddleware, createInterview);
router.post('/answer', authMiddleware, submitAnswer);
router.post('/finish', authMiddleware, finishInterview);
router.get('/history', authMiddleware, getInterviewHistory);
router.get('/:id', authMiddleware, getInterviewById);

module.exports = router;
