// swaggerOptions.ts

import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = swaggerJsDoc({
  swaggerDefinition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'My API', // Title of the API
      version: '1.0.0', // Version of the API
      description: 'API documentation', // Description of the API
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`, // Your API server URL
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to your API docs (adjust as necessary)
  // Additional required options
  encoding: 'utf-8', // Set the encoding
  failOnErrors: true, // Fail on errors
  verbose: true, // Verbose output
  format: 'json', // Format of the output
});

export default swaggerOptions;
