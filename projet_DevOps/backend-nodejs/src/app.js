const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const logger = require('./utils/logger');
const { connectDB } = require('./config/database');
const setupSwagger = require('./config/swagger');
const studentRoutes = require('./routes/students.routes');

const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(compression());

// Middlewares de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger des requêtes
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Route de santé
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Route d'accueil
app.get('/', (req, res) => {
  res.json({
    message: '🎓 Student Management API - Node.js',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      students: '/api/students',
      documentation: '/api-docs'
    }
  });
});

// Documentation Swagger
setupSwagger(app);

// Routes API
app.use('/api/students', studentRoutes);

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  logger.error('Erreur non gérée:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
