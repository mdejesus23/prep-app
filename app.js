const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const preparationRouter = require('./routes/preparationRoutes');
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const readingRouter = require('./routes/readingRoutes');
const resultRouter = require('./routes/resultRoutes');
const songRouter = require('./routes/songsRoutes');
const bookRouter = require('./routes/bookRoutes');
const liturgyRouter = require('./routes/liturgyRoutes');
const bibleRouter = require('./routes/bibleRoutes');
const liturgyOfHoursRouter = require('./routes/liturgyOfHoursRoutes');

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // Trust only one proxy (Render's reverse proxy)
}

// 1) GLOBAL MIDDLEWARES
// implement CORS
// app.use(cors());
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Your React frontend URL
    credentials: true, // Allow cookies to be sent/received
  }),
);

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// API documentation (Swagger UI) — public in every environment so the API can
// be explored without credentials. Mounted before the global helmet() with its
// own policy, because Swagger UI needs a looser CSP (inline styles, blob: web
// workers) than the API itself should run with.
app.use(
  '/api-docs',
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        workerSrc: ["'self'", 'blob:'],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Preparation App API — Documentation',
    swaggerOptions: {
      docExpansion: 'list',
      persistAuthorization: true,
    },
  }),
);

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined')); // prod traffic → stdout → Docker json-file → Dozzle
}

// Limit requests from same API
const limiter = rateLimit({
  max: 1000, // adjust the limit based on you app.
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS. preventing injecting html and javascript code.
app.use(xss());

// Prevent parameter pollution.
app.use(hpp());

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// 3) ROUTES
app.use('/api/v1/preparation', preparationRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/readings', readingRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/results', resultRouter);
app.use('/api/v1/songs', songRouter);
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/liturgy', liturgyRouter);
app.use('/api/v1/bible', bibleRouter);
app.use('/api/v1/liturgy-of-hours', liturgyOfHoursRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// error handler middleware.
app.use(globalErrorHandler);

module.exports = app;
