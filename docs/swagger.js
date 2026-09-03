const swaggerJsdoc = require('swagger-jsdoc');

// Default to a relative server URL so "Try it out" targets whatever origin the
// docs are being served from — correct in local dev and in production without
// any config, and same-origin so it never trips CORS. Set API_URL only to point
// the docs at a different host than the one serving them.
const serverUrl = process.env.API_URL || '/';

// Reusable pagination/filtering query params — every endpoint backed by
// handlerFactory.getAll accepts these (see utils/apiFeatures.js).
const listQueryParameters = [
  {
    in: 'query',
    name: 'page',
    schema: { type: 'integer', minimum: 1, default: 1 },
    description: 'Page number.',
  },
  {
    in: 'query',
    name: 'limit',
    schema: { type: 'integer', minimum: 1, default: 100 },
    description: 'Documents per page.',
  },
  {
    in: 'query',
    name: 'sort',
    schema: { type: 'string', example: '-createdAt' },
    description:
      'Comma-separated fields to sort by; prefix with `-` for descending. Defaults to `-createdAt`.',
  },
  {
    in: 'query',
    name: 'fields',
    schema: { type: 'string', example: 'title,description' },
    description: 'Comma-separated fields to include in the response.',
  },
  {
    in: 'query',
    name: 'search',
    schema: { type: 'string' },
    description:
      'Case-insensitive search across `title`, `category`, `description` and `season`.',
  },
];

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
    servers: [{ url: serverUrl, description: 'This server' }],
    tags: [
      { name: 'Users', description: 'Authentication and user account management' },
      { name: 'Admin', description: 'Theme management for the owning user' },
      { name: 'Readings', description: 'Readings belonging to a theme' },
      { name: 'Preparation', description: 'Theme access and reading votes' },
      { name: 'Results', description: 'Saved preparation results' },
      { name: 'Songs', description: 'Song library' },
      { name: 'Books', description: 'Book library' },
      { name: 'Liturgy of Hours', description: 'Liturgy of the Hours entries' },
      { name: 'Liturgical Calendar', description: 'Liturgical calendar (third-party)' },
      { name: 'Bible', description: 'Bible passages (third-party)' },
    ],
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
      parameters: {
        Page: listQueryParameters[0],
        Limit: listQueryParameters[1],
        Sort: listQueryParameters[2],
        Fields: listQueryParameters[3],
        Search: listQueryParameters[4],
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'fail' },
            message: { type: 'string', example: 'No document found with that ID' },
          },
        },
        // Envelope returned by handlerFactory.getAll — `data` is overridden
        // per endpoint with the concrete item type.
        PaginatedResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            results: { type: 'integer', example: 10, description: 'Items on this page' },
            currentPage: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 100 },
            totalPages: { type: 'integer', example: 3 },
            totalDocuments: { type: 'integer', example: 210 },
            data: { type: 'array', items: { type: 'object' } },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665f1c2a9b1e2a0012ab34cd' },
            username: { type: 'string', example: 'johndoe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            photo: {
              type: 'string',
              example: 'https://res.cloudinary.com/demo/image/upload/profile.jpg',
            },
            cloudinaryId: { type: 'string', example: 'profiles/abc123' },
            votedReadings: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  readingId: { type: 'string', example: '665f1c2a9b1e2a0012ab34ce' },
                  reading: { type: 'string', example: 'John 3:16' },
                },
              },
            },
            votedReadingIds: {
              type: 'array',
              description: 'Virtual: `votedReadings` reduced to their ids.',
              items: { type: 'string', example: '665f1c2a9b1e2a0012ab34ce' },
            },
          },
        },
        Theme: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665f1c2a9b1e2a0012ab34cd' },
            title: { type: 'string', example: 'Advent Sunday Mass' },
            slug: { type: 'string', example: 'advent-sunday-mass' },
            description: { type: 'string', example: 'Readings for the first Sunday of Advent.' },
            passcode: {
              type: 'string',
              maxLength: 10,
              example: 'adv2026',
              description: 'Shared passcode participants use to open the theme.',
            },
            imageUrl: { type: 'string', example: 'https://res.cloudinary.com/demo/theme.jpg' },
            userId: { type: 'string', example: '665f1c2a9b1e2a0012ab34c0' },
            createdAt: { type: 'string', format: 'date-time' },
            readings: {
              type: 'array',
              description: 'Virtual populate — only present on endpoints that populate it.',
              items: { $ref: '#/components/schemas/Reading' },
            },
          },
        },
        Reading: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665f1c2a9b1e2a0012ab34ce' },
            reading: { type: 'string', example: 'John 3:16-21' },
            category: { type: 'string', example: 'gospel' },
            voteCount: { type: 'integer', example: 4 },
            themeId: { type: 'string', example: '665f1c2a9b1e2a0012ab34cd' },
            userId: { type: 'string', example: '665f1c2a9b1e2a0012ab34c0' },
          },
        },
        Result: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665f1c2a9b1e2a0012ab34cf' },
            title: { type: 'string', example: 'Advent Sunday Mass' },
            entranceSong: { type: 'string', example: 'O Come, O Come Emmanuel' },
            firstReading: { type: 'string', example: 'Isaiah 2:1-5' },
            firstPsalm: { type: 'string', example: 'Psalm 122' },
            secondReading: { type: 'string', example: 'Romans 13:11-14' },
            secondPsalm: { type: 'string', example: 'Psalm 25' },
            thirdReading: { type: 'string', example: 'Isaiah 11:1-10' },
            thirdPsalm: { type: 'string', example: 'Psalm 72' },
            gospel: { type: 'string', example: 'Matthew 24:37-44' },
            finalSong: { type: 'string', example: 'Come Thou Long Expected Jesus' },
            userId: { type: 'string', example: '665f1c2a9b1e2a0012ab34c0' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Song: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665f1c2a9b1e2a0012ab34d0' },
            title: { type: 'string', example: 'Holy God, We Praise Thy Name' },
            slug: { type: 'string', example: 'holy-god-we-praise-thy-name' },
            description: { type: 'string', example: 'Traditional hymn of praise.' },
            category: { type: 'string', example: 'praise' },
            imageUrl: { type: 'string', example: 'https://res.cloudinary.com/demo/song.jpg' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Book: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665f1c2a9b1e2a0012ab34d1' },
            title: { type: 'string', example: 'Liturgy of the Hours Vol. 1' },
            slug: { type: 'string', example: 'liturgy-of-the-hours-vol-1' },
            description: { type: 'string', example: 'Advent and Christmas season.' },
            epubUrl: { type: 'string', example: 'https://res.cloudinary.com/demo/book.epub' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        LiturgyOfHours: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665f1c2a9b1e2a0012ab34d2' },
            season: { type: 'string', example: 'Advent' },
            title: { type: 'string', example: 'Morning Prayer — Monday, Week I' },
            slug: { type: 'string', example: 'morning-prayer-monday-week-i' },
            week: { type: 'string', example: 'I' },
            day: { type: 'string', example: 'Monday' },
            order: { type: 'integer', example: 3 },
            htmlContent: { type: 'string', example: '<h2>Invitatory</h2><p>...</p>' },
            sourceFiles: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Not logged in, or the token is invalid/expired',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Error' } },
          },
        },
        NotFound: {
          description: 'No document found with that ID',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Error' } },
          },
        },
        BadRequest: {
          description: 'Invalid or missing input',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/Error' } },
          },
        },
      },
    },
  },
  // Pull @openapi JSDoc annotations from the route files.
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
