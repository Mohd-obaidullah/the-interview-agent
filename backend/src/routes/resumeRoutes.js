const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadResume, getLatestResume } = require('../controllers/resumeController');

router.post('/upload', authMiddleware, upload.single('resume'), uploadResume);
router.get('/latest', authMiddleware, getLatestResume);

module.exports = router;
