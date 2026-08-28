const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./src/config/database');
const { apiLimiter, authLimiter } = require('./src/middleware/rateLimiter');

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate Limiters
app.use('/api/auth', authLimiter);
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/donations', require('./src/routes/donationRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/reports', require('./src/routes/reportRoutes'));
app.use('/api/claims', require('./src/routes/claimRoutes'));

// 404 Route Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found - ${req.originalUrl}`
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));