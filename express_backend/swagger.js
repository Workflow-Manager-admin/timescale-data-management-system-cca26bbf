const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Timescale Data Management System API',
      version: '1.0.0',
      description: 'REST API for organizations, facilities, fill events, and tag values. Powered by Express, Prisma, and TimescaleDB.',
    }
  },
  // Include TypeScript route/controller files for annotation
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
