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
const toolRoutes = require('./routes/tools');
const adminRoutes = require('./routes/admin');
const chatRoutes = require('./routes/chat');
const webhookRoutes = require('./routes/webhook');
const telegramRoutes = require('./routes/telegram');
const gameApiRoutes = require('./routes/gameApi');
const battleApiRoutes = require('./routes/battleApi');
const englishAirApiRoutes = require('./routes/englishAirApi');
const proRoutes = require('./routes/pro');
const muncuiRoutes = require('./routes/muncui');

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
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://connect.facebook.net',
          'https://pagead2.googlesyndication.com',
          'https://*.googlesyndication.com',
          'https://*.googleadservices.com',
          'https://*.google.com',
          'https://*.doubleclick.net',
          'https://*.gstatic.com',
        ],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: [
          "'self'",
          'https://connect.facebook.net',
          'https://*.facebook.com',
          'https://*.googlesyndication.com',
          'https://*.doubleclick.net',
          'https://*.google.com',
        ],
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
// The game's PWA app-shell files (index.html/app.js/style.css/sw.js/manifest)
// get redeployed often via `git pull` on the server — without an explicit
// no-store here, the hosting's LiteSpeed edge cache (see the no-store
// middleware below for the same issue on dynamic routes) and browsers can
// keep serving an old cached copy to phones that already installed the PWA,
// so a fix never reaches them until they uninstall/reinstall.
// Same applies to /english-air (the English-learning PWA), /bibi-history
// (the history-learning PWA), and /mun-cui-app (the shell for the sawdust &
// firewood yard management PWA — its sw.js/manifest/icons are the only
// pieces served as plain static files; the actual app pages are
// server-rendered per session under /mun-cui, kept in a differently-named
// static folder so express.static's directory-redirect behavior never
// shadows the /mun-cui router), so all app shells are matched by one
// pattern here.
const PWA_SHELL_FILES =
  /\/(game|english-air|bibi-history|mun-cui-app)\/(index\.html|app\.js|style\.css|sw\.js|grades-data\.js|course(-[ab]\d|-lop\d+)?\.js|manifest\.(json|webmanifest))$/;
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    const normalized = filePath.replace(/\\/g, '/');
    if (PWA_SHELL_FILES.test(normalized)) {
      res.set('Cache-Control', 'no-store');
    }
    // mun-cui-app/sw.js lives outside the /mun-cui/ path it needs to control
    // (that path is the server-rendered app, not a static folder) — this
    // header is how a service worker is allowed to claim a wider scope than
    // the directory its own script file sits in.
    if (normalized.endsWith('/mun-cui-app/sw.js')) {
      res.set('Service-Worker-Allowed', '/mun-cui/');
    }
  },
}));

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

const shopeePicks = require('./data/shopeePicks');

app.use((req, res, next) => {
  res.locals.appName = process.env.APP_NAME || 'Dinh Thi Ai';
  res.locals.appUrl = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
  res.locals.canonicalUrl = `${res.locals.appUrl}${req.originalUrl}`;
  res.locals.currentPath = req.path;
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  // Shared across every page that includes partials/shopee-picks.ejs
  // (blog posts, courses, tools, homepage) so each controller doesn't
  // need to load and pass it individually.
  res.locals.shopeePicks = shopeePicks;
  next();
});

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/blog', blogRoutes);
// Mounted as /kho-tai-nguyen rather than /tools: hosting's security layer
// blocks requests to common admin/dev-tool path signatures like "/tools",
// the same way it blocks "/webhook*" (see the webhookRoutes mount below).
app.use('/kho-tai-nguyen', toolRoutes);
app.use('/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/game', gameApiRoutes);
app.use('/api/battle', battleApiRoutes);
app.use('/api/english-air', englishAirApiRoutes);
app.use('/pro', proRoutes);
app.use('/mun-cui', muncuiRoutes);
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
const httpServer = app.listen(PORT, () => {
  console.log(`[server] Dinh Thi Ai dang chay tai http://localhost:${PORT}`);
});

// Thach Dau (Mon-Maths 1v1/2v2 battle) realtime layer. Socket.IO attaches to
// the ALREADY-listening httpServer above (no extra listen() call, so this is
// safe under the Passenger-hijack constraint documented above). Chosen over
// raw `ws` specifically because Socket.IO auto-falls-back to HTTP
// long-polling if this shared LiteSpeed/Passenger hosting doesn't proxy the
// WebSocket upgrade correctly — unverified on this host as of first setup,
// see PHASE0-WS-CHECK.md for the smoke test used to confirm it.
const { Server: SocketIOServer } = require('socket.io');
const io = new SocketIOServer(httpServer, {
  path: '/socket.io/',
  cors: false,
  transports: ['websocket', 'polling'],
});
require('./services/battleSocket')(io);

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
