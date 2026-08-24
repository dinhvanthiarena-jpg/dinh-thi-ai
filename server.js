require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const helmet = require('helmet');
const morgan = require('morgan');
const methodOverride = require('method-override');
const rateLimit = require('express-rate-limit');
const expressLayouts = require('express-ejs-layouts');

const connectDB = require('./config/db');
const { attachUser } = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { startScheduler } = require('./services/contentScheduler');
const telegramService = require('./services/telegramService');

// Express 4 does not catch errors thrown inside async route handlers, so an
// unhandled rejection there would otherwise crash the whole process (Node
// terminates on unhandled rejections by default). Log and keep serving
// instead — a single bad request should never take the whole site down.
process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err);
});

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const checkoutRoutes = require('./routes/checkout');
const dashboardRoutes = require('./routes/dashboard');
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin');
const chatRoutes = require('./routes/chat');
const webhookRoutes = require('./routes/webhook');
const telegramRoutes = require('./routes/telegram');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://connect.facebook.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://connect.facebook.net', 'https://*.facebook.com'],
        frameSrc: ["'self'", 'https:'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.urlencoded({ extended: true, limit: '200kb' }));
app.use(
  express.json({
    limit: '200kb',
    // Keep the raw bytes around so the Messenger webhook can verify Facebook's
    // X-Hub-Signature-256 HMAC, which must be computed over the exact body
    // bytes, not a re-serialized JSON.stringify(req.body).
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  createDatabaseTable: true,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
    },
  })
);
app.use(flash());

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
app.use(['/auth/login', '/auth/register'], authLimiter);

app.use(attachUser);

// The hosting's LiteSpeed edge cache defaults to caching any GET response
// that doesn't explicitly opt out, including dynamic, per-session pages like
// the admin panel — silently serving one point-in-time snapshot to every
// later request until the cache entry itself expires. Every non-static
// response here is generated per-request (sessions, DB reads), so none of it
// should ever be cached.
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use((req, res, next) => {
  res.locals.appName = process.env.APP_NAME || 'Dinh Thi Ai';
  res.locals.appUrl = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
  res.locals.canonicalUrl = `${res.locals.appUrl}${req.originalUrl}`;
  res.locals.currentPath = req.path;
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  next();
});

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/blog', blogRoutes);
app.use('/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
// Mounted as /fb-events rather than /webhook: hosting's security layer
// blocks GET requests to any "/webhook*" path (a common signature used by
// scanners to probe for SSRF), which also silently ate Facebook's own
// GET-based webhook verification handshake.
app.use('/fb-events', webhookRoutes);
app.use('/tg-events', telegramRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// cPanel's Passenger integration hijacks the first http.Server#listen() call
// in the process to wire up its own request routing, so it must happen
// synchronously at startup — not after an awaited DB connection. Calling it
// late (or more than once, e.g. if Passenger spawns a fresh process per
// request while still waiting on that promise) throws "listen() was called
// more than once", which used to get mis-logged here as a DB error.
app.listen(PORT, () => {
  console.log(`[server] Dinh Thi Ai dang chay tai http://localhost:${PORT}`);
});

connectDB()
  .then(() => {
    startScheduler();
    telegramService.ensureWebhook();
  })
  .catch((err) => {
    console.error('[server] Khong the ket noi database:', err.message);
    process.exit(1);
  });

module.exports = app;
