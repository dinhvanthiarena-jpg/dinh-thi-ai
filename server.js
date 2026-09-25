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
const { affiliateTracking } = require('./middleware/affiliateTracking');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { startScheduler } = require('./services/contentScheduler');
const { batDauNhacHoc } = require('./services/nhacHocService');
const telegramService = require('./services/telegramService');
// Zalo tu dong la phan DANG LAM DO: tep dich vu va goi zca-js co the chua co
// tren may chu. Truoc day require thang o day, nen mot lan day server.js len la
// ca SITE chet 503 voi loi MODULE_NOT_FOUND. Thieu thi bo qua, phan con lai cua
// site van phai chay.
let zaloAutoService = null;
try {
  zaloAutoService = require('./services/zaloAutoService');
} catch (e) {
  console.warn('[zaloAutoService] chua san sang, bo qua:', e.message);
}

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
const walletRoutes = require('./routes/wallet');
const referralRoutes = require('./routes/referral');
const accountRoutes = require('./routes/account');
const autopostRoutes = require('./routes/autopost');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('trust proxy', 1);

app.use(
  helmet({
    // Helmet mặc định gắn "Cross-Origin-Resource-Policy: same-origin" lên MỌI
    // response (kể cả ảnh tĩnh /uploads, /images) — chặn các trình thu thập
    // dữ liệu cross-origin (facebookexternalhit khi Facebook lấy ảnh xem
    // trước link, Zalo, các mạng xã hội khác) tải được ảnh, dù ảnh vẫn load
    // bình thường khi vào thẳng trình duyệt hay fetch cùng-origin. Phát hiện
    // 2026-09-25: dán link bài blog lên Facebook, tiêu đề/mô tả hiện đúng
    // (Facebook đọc được HTML) nhưng ảnh trống trơn (Facebook bị CORP chặn
    // tải ảnh og:image). Site này là nội dung công khai, ảnh vốn dùng để chia
    // sẻ lên mạng xã hội — nên nới CORP thành "cross-origin" cho toàn site.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
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
        // accounts.google.com PHAI co o day: nut dang nhap Google tu tai bang dinh
        // dang tu https://accounts.google.com/gsi/style. Thieu dong nay thi trinh
        // duyet chan thang, nut hien ra tran trui va bao loi do trong console.
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com',
          'https://accounts.google.com'],
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
// Body parser riêng cho /api/auto-post, đặt TRƯỚC giới hạn 200kb chung bên
// dưới — bài kèm ảnh (imageBase64) thường vượt 200kb, nên route này cần giới
// hạn lớn hơn (8mb) và phải "ăn" trước khi tới middleware json 200kb chung.
app.use('/api/auto-post', express.json({ limit: '8mb' }), autopostRoutes);
app.use('/api/aai-license', express.json(), require('./routes/aaiLicense'));
app.use('/api/fbai-license', express.json(), require('./routes/fbaiLicense'));
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
// Same applies to /english-air (the English-learning PWA) and /bibi-history
// (the history-learning PWA), so all app shells are matched by one pattern here.
const PWA_SHELL_FILES =
  /\/(game|english-air|bibi-history)\/(index\.html|app\.js|style\.css|sw\.js|grades-data\.js|course(-[ab]\d|-lop\d+)?\.js|manifest\.(json|webmanifest))$/;
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (PWA_SHELL_FILES.test(filePath.replace(/\\/g, '/'))) {
      res.set('Cache-Control', 'no-store');
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
app.use(affiliateTracking);

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
const { BLOG_CATEGORIES } = require('./utils/blogCategories');

app.use((req, res, next) => {
  res.locals.appName = process.env.APP_NAME || 'Vietpro';
  res.locals.appUrl = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
  res.locals.canonicalUrl = `${res.locals.appUrl}${req.originalUrl}`;
  res.locals.currentPath = req.path;
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  // Shared across every page that includes partials/shopee-picks.ejs
  // (blog posts, courses, tools, homepage) so each controller doesn't
  // need to load and pass it individually.
  res.locals.shopeePicks = shopeePicks;
  // Dùng cho thanh chuyên mục ngang (kiểu báo điện tử) — hiện trên mọi trang.
  res.locals.blogCategories = BLOG_CATEGORIES;
  res.locals.currentCategory = req.query.category || '';
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
app.use('/vi', walletRoutes);
// LƯU Ý: "/gioi-thieu" (không có "-ban-be") đã là trang "Giới thiệu" (About)
// có sẵn, xử lý bởi indexRoutes (routes/index.js -> homeController.about) —
// tuyệt đối không trùng path đó, sẽ bị nuốt mất bởi route có sẵn.
app.use('/gioi-thieu-ban-be', referralRoutes);
app.use('/tai-khoan', accountRoutes);
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
    batDauNhacHoc();   // nhắc học cho English Air
    telegramService.ensureWebhook();
    if (zaloAutoService) {
      zaloAutoService.init().catch((e) => console.error('[zaloAutoService] init lỗi:', e.message));
    }

    // Tự động duyệt hoa hồng AFF đã chờ đủ hạn (mặc định 7 ngày, xem
    // services/commissionService.js) — chạy ngay lúc khởi động + mỗi giờ.
    const commissionService = require('./services/commissionService');
    const duyetHoaHong = () =>
      commissionService.duyetHoaHongDaHan().catch((e) => console.error('[commissionService] lỗi tự duyệt hoa hồng:', e.message));
    duyetHoaHong();
    setInterval(duyetHoaHong, 60 * 60 * 1000);
  })
  .catch((err) => {
    console.error('[server] Khong the ket noi database:', err.message);
    process.exit(1);
  });

module.exports = app;
