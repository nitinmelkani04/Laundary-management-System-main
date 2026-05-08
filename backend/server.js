
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/auth');
// const orderRoutes = require('./routes/orders');
// const errorHandler = require('./middleware/errorHandler');

// const app = express();

// // Connect to MongoDB
// connectDB();

// // ✅ FIXED CORS — allows multiple origins
// const allowedOrigins = [
//   'http://localhost:3000',
//   'http://localhost:5173',
//   // Add your deployed frontend URL here when you deploy:
//   process.env.CLIENT_URL,
// ].filter(Boolean); // removes undefined if CLIENT_URL not set

// app.use(cors({
//   origin: (origin, callback) => {
//     // Allow requests with no origin (mobile apps, Postman, curl)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }
//     console.warn(`CORS blocked: ${origin}`);
//     return callback(new Error(`CORS not allowed for origin: ${origin}`));
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

// // Handle preflight for all routes
// app.options('*', cors());

// app.use(express.json());
// app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// // Health check
// app.get('/health', (req, res) => {
//   res.json({
//     success: true,
//     message: 'CleanPress API running 🚀',
//     timestamp: new Date(),
//     env: process.env.NODE_ENV,
//   });
// });

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/orders', orderRoutes);

// // 404
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
// });

// // Global error handler
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server on port ${PORT} | mode: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
// });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const errorHandler = require('./middleware/errorHandler');

const app = express();

connectDB();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean).map(o => o.trim().replace(/\/$/, '')); // remove trailing slashes

const corsOptions = {
  origin: (origin, callback) => {
    // Allow no-origin requests (Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`CORS blocked: ${origin}`);
    console.warn(`Allowed origins: ${allowedOrigins.join(', ')}`);
    return callback(new Error(`CORS not allowed for: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, // ← KEY FIX: some browsers send 204 which breaks preflight
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Handle OPTIONS preflight explicitly for every route
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'CleanPress API running 🚀',
    timestamp: new Date(),
    env: process.env.NODE_ENV,
    allowedOrigins,
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT} | mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
});