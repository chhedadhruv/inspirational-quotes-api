// Load environment variables
require('dotenv').config();

const express = require('express');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const app = express();

// Configuration from environment variables
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW) || 60000;
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX) || 60;
const HELMET_ENABLED = process.env.HELMET_ENABLED === 'true';
const DEBUG = process.env.DEBUG === 'true';
const PRETTY_PRINT_JSON = process.env.PRETTY_PRINT_JSON === 'true';
const API_PREFIX = process.env.API_PREFIX || '/api';

// Load quotes from local file
const data = JSON.parse(fs.readFileSync('./quotes.json'));
const quotes = data.quotes;

// Disable x-powered-by header
app.disable('x-powered-by');

// JSON formatting
if (PRETTY_PRINT_JSON && NODE_ENV === 'development') {
  app.set('json spaces', 2);
}

// Secure HTTP headers (configurable)
if (HELMET_ENABLED) {
  app.use(helmet());
}

// Rate limiter with environment configuration
const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests, try again later.",
    retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000)
  }
});
app.use(API_PREFIX, limiter);

// Debug logging middleware
if (DEBUG) {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Routes

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Quote API!',
    version: process.env.API_VERSION || 'v1',
    environment: NODE_ENV,
    endpoints: {
      random: `${API_PREFIX}/quote/random`,
      quotes: `${API_PREFIX}/quotes`,
      search: `${API_PREFIX}/quotes/search?q=keyword`,
      author: `${API_PREFIX}/quotes/author/:name`,
      tag: `${API_PREFIX}/quotes/tag/:tag`,
      byId: `${API_PREFIX}/quote/:id`,
      date: `${API_PREFIX}/quotes/date/:date`,
      length: `${API_PREFIX}/quotes/length?min=0&max=100`,
      tags: `${API_PREFIX}/tags`
    }
  });
});

app.get(`${API_PREFIX}/quote/random`, (req, res) => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  res.json(quote);
});

app.get(`${API_PREFIX}/quotes`, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || quotes.length;
  const start = (page - 1) * limit;
  const end = start + limit;

  res.json({
    page,
    limit,
    total: quotes.length,
    results: quotes.slice(start, end)
  });
});

app.get(`${API_PREFIX}/quotes/search`, (req, res) => {
  const q = req.query.q?.toLowerCase();
  if (!q) return res.status(400).json({ error: 'Missing search query' });
  const result = quotes.filter(qt => qt.content.toLowerCase().includes(q));
  res.json({
    query: req.query.q,
    total: result.length,
    results: result
  });
});

app.get(`${API_PREFIX}/quotes/author/:name`, (req, res) => {
  const name = req.params.name.toLowerCase();
  const result = quotes.filter(q => q.author.toLowerCase().includes(name));
  res.json({
    author: req.params.name,
    total: result.length,
    results: result
  });
});

app.get(`${API_PREFIX}/quotes/tag/:tag`, (req, res) => {
  const tag = req.params.tag.toLowerCase();
  const result = quotes.filter(q => q.tags.map(t => t.toLowerCase()).includes(tag));
  res.json({
    tag: req.params.tag,
    total: result.length,
    results: result
  });
});

app.get(`${API_PREFIX}/quote/:id`, (req, res) => {
  const id = req.params.id;
  const quote = quotes.find(q => q._id === id);
  if (!quote) return res.status(404).json({ error: 'Quote not found' });
  res.json(quote);
});

app.get(`${API_PREFIX}/quotes/date/:date`, (req, res) => {
  const date = req.params.date;
  const result = quotes.filter(q => q.dateAdded.startsWith(date));
  res.json({
    date: req.params.date,
    total: result.length,
    results: result
  });
});

app.get(`${API_PREFIX}/tags`, (req, res) => {
  const tags = new Set();
  quotes.forEach(q => q.tags.forEach(tag => tags.add(tag)));
  res.json({
    total: tags.size,
    tags: [...tags].sort()
  });
});

app.get(`${API_PREFIX}/quotes/length`, (req, res) => {
  const min = parseInt(req.query.min) || 0;
  const max = parseInt(req.query.max) || Infinity;
  const result = quotes.filter(q => q.length >= min && q.length <= max);
  res.json({
    filter: { min, max: max === Infinity ? 'unlimited' : max },
    total: result.length,
    results: result
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: process.env.API_VERSION || 'v1'
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.method} ${req.originalUrl} does not exist.`,
    availableRoutes: [
      'GET /',
      `GET ${API_PREFIX}/quote/random`,
      `GET ${API_PREFIX}/quotes`,
      `GET ${API_PREFIX}/quotes/search`,
      `GET ${API_PREFIX}/quotes/author/:name`,
      `GET ${API_PREFIX}/quotes/tag/:tag`,
      `GET ${API_PREFIX}/quote/:id`,
      `GET ${API_PREFIX}/quotes/date/:date`,
      `GET ${API_PREFIX}/quotes/length`,
      `GET ${API_PREFIX}/tags`,
      'GET /health'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Quote API v${process.env.API_VERSION || 'v1'} running at http://localhost:${PORT}`);
  console.log(`📊 Environment: ${NODE_ENV}`);
  console.log(`🔒 Rate Limit: ${RATE_LIMIT_MAX} requests per ${RATE_LIMIT_WINDOW/1000} seconds`);
  console.log(`🛡️  Security Headers: ${HELMET_ENABLED ? 'Enabled' : 'Disabled'}`);
  console.log(`🐛 Debug Mode: ${DEBUG ? 'Enabled' : 'Disabled'}`);
  console.log(`📚 Total Quotes: ${quotes.length}`);
  if (DEBUG) {
    console.log(`🔍 API Endpoints: ${API_PREFIX}/*`);
  }
});
