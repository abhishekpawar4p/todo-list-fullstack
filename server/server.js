const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const taskRoutes = require('./routes/taskRoutes');
const { limiter, helmetConfig } = require('./middleware/security');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create a write stream for logging
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Middleware
app.use(cors()); // Allow frontend to connect
app.use(helmetConfig); // Security headers
app.use('/api/', limiter); // Rate limiting for all API routes

// Logging middleware
if (process.env.NODE_ENV === 'production') {
  // Production: Log to file
  app.use(morgan('combined', { stream: accessLogStream }));
} else {
  // Development: Log to console
  app.use(morgan('dev'));
}

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse form data

// Request timing middleware
app.use((req, res, next) => {
  req.startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    if (duration > 1000) {
      console.warn(`⚠️  Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  next();
});

// Routes
app.use('/api/tasks', taskRoutes);

// Health check endpoint with detailed info
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.stack);
  
  // Log error to file in production
  if (process.env.NODE_ENV === 'production') {
    const errorLogStream = fs.createWriteStream(
      path.join(logsDir, 'error.log'),
      { flags: 'a' }
    );
    errorLogStream.write(
      `[${new Date().toISOString()}] ${err.stack}\n`
    );
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server only if not being imported for testing
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api/tasks`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;