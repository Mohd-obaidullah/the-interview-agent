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

// Utility to print all registered routes
const printRoutes = (app) => {
  console.log('\n--- Registered Express Routes ---');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) { // Routes registered directly on the app
      const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
      console.log(`${methods} ${middleware.route.path}`);
    } else if (middleware.name === 'router') { // Router middleware
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods).join(', ').toUpperCase();
          let path = handler.route.path;
          
          // Reconstruct the base path from the middleware regexp if possible
          let basePath = '';
          const match = middleware.regexp.toString().match(/^\/\^\\\/(.*?)\\\/\?\(\?\=\\\/\|\$\)/);
          if (match && match[1]) {
            basePath = '/' + match[1].replace(/\\\//g, '/');
          }
          
          console.log(`${methods} ${basePath}${path}`);
        }
      });
    }
  });
  console.log('---------------------------------\n');
};

printRoutes(app);

app.listen(PORT, HOST, () => {
  console.log(`🚀 The Interview Agent Backend listening on http://${HOST}:${PORT}`);
});
