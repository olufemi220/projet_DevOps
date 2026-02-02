const app = require('./app');
const { connectDB } = require('./config/database');
const logger = require('./utils/logger');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Connexion à la base de données et démarrage du serveur
const startServer = async () => {
  try {
    // Connexion à MySQL
    await connectDB();
    
    // Démarrage du serveur
    app.listen(PORT, () => {
      logger.info(`🚀 Serveur démarré sur le port ${PORT}`);
      logger.info(`📍 http://localhost:${PORT}`);
      logger.info(`📚 Documentation Swagger: http://localhost:${PORT}/api-docs`);
      logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  logger.info('SIGTERM reçu. Arrêt gracieux du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT reçu. Arrêt gracieux du serveur...');
  process.exit(0);
});

// Démarrer le serveur
startServer();
