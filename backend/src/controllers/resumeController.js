const { parsePDF } = require('../services/pdfService');
const { extractResumeProfile } = require('../services/geminiService');

let resumeStorage = {};

const uploadResume = async (req, res) => {
  try {
    let rawText = '';
    let filename = 'resume.pdf';

    if (req.file) {
      filename = req.file.originalname;
      if (filename.endsWith('.pdf')) {
        rawText = await parsePDF(req.file.buffer);
      } else {
        rawText = req.file.buffer.toString('utf-8');
      }
    } else if (req.body.text) {
      rawText = req.body.text;
      filename = 'pasted_resume.txt';
    } else {
      return res.status(400).json({ error: 'No resume file or text provided' });
    }

    const extractedProfile = await extractResumeProfile(rawText);

    const resumeData = {
      id: `resume_${Date.now()}`,
      userId: req.userId,
      filename,
      rawText,
      extractedProfile,
      uploadedAt: new Date()
    };

    resumeStorage[req.userId] = resumeData;

    res.status(200).json({
      message: 'Resume parsed successfully',
      resume: resumeData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLatestResume = async (req, res) => {
  try {
    const resume = resumeStorage[req.userId] || {
      filename: 'sample_resume.pdf',
      extractedProfile: {
        skills: ['JavaScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'System Design'],
        technologies: ['React', 'Node.js', 'Tailwind CSS', 'Git', 'REST API'],
        projects: ['AI Mock Interviewer Platform', 'E-Commerce SaaS'],
        experience: ['Full Stack Developer (2 Years)'],
        education: ['B.S. Computer Science & Engineering'],
        achievements: ['Won 1st Place in Hackathon 2025']
      }
    };
    res.json({ resume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  uploadResume,
  getLatestResume,
  resumeStorage
};
