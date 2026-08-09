const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Connect Database (with fallback)
connectDB();

// CORS configuration (supports production domain whitelist & local dev)
const allowedOrigins = process.env.CLIENT_URL ? [process.env.CLIENT_URL] : '*';
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/interview', require('./routes/interviewRoutes'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'The Interview Agent Backend API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date()
  });
});

// Production-ready Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({
    error: isProd ? 'Internal Server Error' : (err.message || 'Internal Server Error')
  });
});

app.listen(PORT, HOST, () => {
  console.log(`🚀 The Interview Agent Backend listening on http://${HOST}:${PORT}`);
});
