const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Connexion à MySQL réussie');
    
    // Synchroniser les modèles avec la base de données
    await sequelize.sync({ alter: false });
    logger.info('✅ Modèles synchronisés avec la base de données');
  } catch (error) {
    logger.error('❌ Erreur de connexion à MySQL:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
