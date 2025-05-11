const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');
const commentRoutes = require('./routes/commentRoutes');
const statsRoutes = require('./routes/statsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminLoginRoute = require('./routes/adminLoginRoute');
const departmentRoutes = require('./routes/departmentRoutes');

const app = express();

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security headers
app.use(helmet());

// Sanitize data
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs
});
app.use('/api/', limiter);

// Prevent http param pollution - with safe configuration
// Comment out hpp middleware as it's causing issues with req.query
// app.use(hpp());

// Alternative: Use hpp with explicit whitelist if needed
app.use(hpp({
  whitelist: ['status', 'sort', 'page', 'limit', 'fields', 'category'],
}));

// CORS configuration - use a single approach to avoid conflicts
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',  // Allow frontend origin
    'http://localhost:3000',  // Allow client app
    'http://localhost:3001',  // Allow admin panel
    'http://localhost:3002'   // Allow admin panel on alternate port
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Total-Count'],
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 204,
  preflightContinue: false
}));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/adminlogin', adminLoginRoute);
app.use('/api/departments', departmentRoutes);

// Basic route for testing
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to Citizen Report API',
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Handle 404 errors
app.use((req, res, _next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5002;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, _promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
