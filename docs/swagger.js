const swaggerJsdoc = require('swagger-jsdoc');

// Build the base server URL from env so the "Try it out" button targets the
// right host in each environment (falls back to local dev).
const serverUrl =
  process.env.API_URL ||
  `http://localhost:${process.env.PORT || 3000}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Preparation App API',
      version: '1.0.0',
      description:
        'REST API documentation for the Preparation App. Most endpoints '
        + 'require authentication via a JWT sent as a Bearer token or as the '
        + '`jwt` cookie set on login.',
    },
    servers: [{ url: serverUrl, description: 'Current environment' }],
    components: {
      securitySchemes: {
        // Matches authController.protect: `Authorization: Bearer <token>`
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        // Matches authController.protect: the `jwt` cookie set at login
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'jwt',
        },
      },
    },
  },
  // Pull @openapi JSDoc annotations from the route files.
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
