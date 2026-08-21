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

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const checkoutRoutes = require('./routes/checkout');
const dashboardRoutes = require('./routes/dashboard');
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: false, // enable/tune CSP once external asset domains are finalized
  })
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
    cookie: { maxAge: 1000 * 60 * 60 * 24, secure: process.env.NODE_ENV === 'production' },
  })
);
app.use(flash());

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
app.use(['/auth/login', '/auth/register'], authLimiter);

app.use(attachUser);

app.use((req, res, next) => {
  res.locals.appName = process.env.APP_NAME || 'Dinh Thi Ai';
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

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[server] Dinh Thi Ai dang chay tai http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[server] Khong the ket noi database:', err.message);
    process.exit(1);
  });

module.exports = app;
