// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'API documentation for user management with admin access',
    },
  },
  apis: ['./routes/*.js'], // Path to your API docs
};

const swaggerDocs = swaggerJsDoc(options);

module.exports = {
  swaggerUi,
  swaggerDocs,
};
