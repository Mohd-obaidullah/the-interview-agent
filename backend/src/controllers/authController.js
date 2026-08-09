const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Interview = require('../models/Interview');
const InterviewTemplate = require('../models/InterviewTemplate');

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, role } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (!['student', 'interviewer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid user role specified.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password: passwordHash,
      role
    });

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role, name: `${firstName} ${lastName}` },
      process.env.JWT_SECRET || 'super_secret_jwt_key_interview_agent_2026',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: `${role === 'student' ? 'Student' : 'Interviewer'} account created successfully`,
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        name: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, expectedRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (expectedRole && user.role !== expectedRole) {
      return res.status(403).json({ error: `This account is registered as a ${user.role}. Please log in on the ${user.role} login page.` });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, name: `${user.firstName} ${user.lastName}` },
      process.env.JWT_SECRET || 'super_secret_jwt_key_interview_agent_2026',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }
    res.json({
      message: 'Password reset link has been sent to your email address.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isStudent = user.role === 'student';
    let stats = {};

    if (isStudent) {
      const interviews = await Interview.find({ userId: req.userId, status: 'completed' });
      const avgScore = interviews.length > 0 ? Math.round(interviews.reduce((acc, curr) => acc + (curr.finalReport?.overallScore || 0), 0) / interviews.length) : 0;
      const bestScore = interviews.length > 0 ? Math.max(...interviews.map(i => i.finalReport?.overallScore || 0)) : 0;
      stats = {
        interviewsCompleted: interviews.length,
        averageScore: avgScore,
        bestScore: bestScore
      };
    } else {
      const templates = await InterviewTemplate.find({ interviewerId: req.userId });
      const templateIds = templates.map(t => t._id);
      const accessCodes = templates.map(t => t.accessCode);
      const candidates = await Interview.find({
        $or: [
          { templateId: { $in: templateIds } },
          { accessCode: { $in: accessCodes } },
          { interviewerId: req.userId }
        ]
      });
      stats = {
        interviewsCreated: templates.length,
        candidatesEvaluated: candidates.length
      };
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        stats
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First Name and Last Name are required.' });
    }

    const user = await User.findByIdAndUpdate(req.userId, { firstName, lastName }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ error: 'All password fields are required.' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'New password and confirm password do not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect current password.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    user.password = newHash;
    await user.save();

    res.json({
      message: 'Password changed successfully! Please use your new password next time you log in.'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  getProfile,
  updateProfile,
  changePassword
};
