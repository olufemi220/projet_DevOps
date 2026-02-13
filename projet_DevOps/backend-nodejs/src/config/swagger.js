const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Management API - Node.js',
      version: '1.0.0',
      description: 'API REST pour la gestion des étudiants construite avec Node.js, Express et MySQL',
      contact: {
        name: 'Backend Team',
        email: 'contact@studentmanagement.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement'
      },
      {
        url: 'http://production-url.com',
        description: 'Serveur de production'
      }
    ],
    tags: [
      {
        name: 'Students',
        description: 'Gestion des étudiants'
      }
    ]
  },
  apis: [
    './src/controllers/*.js',
    './src/routes/*.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  // Documentation Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Student API - Documentation'
  }));

  // JSON de la documentation
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = setupSwagger;
