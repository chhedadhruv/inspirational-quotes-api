// Load environment variables
require("dotenv").config();

const express = require("express");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const app = express();

// Configuration from environment variables
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW) || 60000;
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX) || 60;
const HELMET_ENABLED = process.env.HELMET_ENABLED === "true";
const DEBUG = process.env.DEBUG === "true";
const PRETTY_PRINT_JSON = process.env.PRETTY_PRINT_JSON === "true";
const API_PREFIX = process.env.API_PREFIX || "/api";

// Load quotes from local file
const data = JSON.parse(fs.readFileSync("./quotes.json"));
const quotes = data.quotes;

// Disable x-powered-by header
app.disable("x-powered-by");

// JSON formatting
if (PRETTY_PRINT_JSON && NODE_ENV === "development") {
  app.set("json spaces", 2);
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
    retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000),
  },
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

app.get("/", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quote API - Documentation</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            --accent-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            --glass-bg: rgba(255, 255, 255, 0.1);
            --glass-border: rgba(255, 255, 255, 0.2);
            --shadow-light: 0 8px 32px rgba(0, 0, 0, 0.1);
            --shadow-medium: 0 16px 48px rgba(0, 0, 0, 0.15);
            --shadow-heavy: 0 24px 64px rgba(0, 0, 0, 0.2);
            --text-primary: #1a1a1a;
            --text-secondary: #6b7280;
            --text-accent: #667eea;
            --border-radius: 24px;
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.7;
            color: var(--text-primary);
            background: var(--primary-gradient);
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
        }
        
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
            z-index: -1;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .header {
            text-align: center;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            padding: 60px 40px;
            border-radius: var(--border-radius);
            margin-bottom: 40px;
            box-shadow: var(--shadow-medium);
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--primary-gradient);
        }
        
        .header h1 {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 700;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 16px;
            letter-spacing: -0.02em;
            animation: slideInDown 0.8s ease-out;
        }
        
        .header p {
            font-size: 1.25rem;
            color: var(--text-secondary);
            margin-bottom: 32px;
            font-weight: 400;
            animation: slideInUp 0.8s ease-out 0.2s both;
        }
        
        .badge {
            display: inline-block;
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            color: var(--text-primary);
            padding: 8px 16px;
            border-radius: 50px;
            font-size: 0.875rem;
            font-weight: 500;
            margin: 6px;
            transition: var(--transition);
            animation: fadeIn 0.8s ease-out 0.4s both;
        }
        
        .badge:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-light);
        }
        
        .content {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            padding: 60px 40px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-medium);
            animation: slideInUp 0.8s ease-out 0.6s both;
        }
        
        .section {
            margin-bottom: 60px;
        }
        
        .section h2 {
            font-size: 2.5rem;
            font-weight: 700;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 32px;
            position: relative;
            letter-spacing: -0.02em;
        }
        
        .section h2::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 60px;
            height: 4px;
            background: var(--primary-gradient);
            border-radius: 2px;
        }
        
        .endpoint {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 20px;
            padding: 32px;
            margin-bottom: 24px;
            transition: var(--transition);
            position: relative;
            overflow: hidden;
        }
        
        .endpoint::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--accent-gradient);
            transform: translateX(-100%);
            transition: var(--transition);
        }
        
        .endpoint:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-medium);
            border-color: rgba(255, 255, 255, 0.5);
        }
        
        .endpoint:hover::before {
            transform: translateX(0);
        }
        
        .endpoint h3 {
            color: var(--text-primary);
            margin-bottom: 16px;
            font-size: 1.5rem;
            font-weight: 600;
        }
        
        .method {
            display: inline-block;
            background: var(--accent-gradient);
            color: white;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 600;
            margin-right: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3);
        }
        
        .url {
            background: rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(0, 0, 0, 0.1);
            padding: 16px;
            border-radius: 12px;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
            margin: 16px 0;
            word-break: break-all;
            font-size: 0.95rem;
            color: var(--text-primary);
            transition: var(--transition);
        }
        
        .url:hover {
            background: rgba(0, 0, 0, 0.08);
            border-color: rgba(0, 0, 0, 0.2);
        }
        
        .example {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: #e2e8f0;
            padding: 24px;
            border-radius: 12px;
            margin: 16px 0;
            overflow-x: auto;
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
                 .example pre {
             margin: 0;
             font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
             font-size: 0.9rem;
             line-height: 1.6;
             user-select: all;
             -webkit-user-select: all;
             -moz-user-select: all;
             cursor: text;
             white-space: pre-wrap;
             word-wrap: break-word;
             overflow-wrap: break-word;
             max-width: 100%;
         }
         
         .example pre:hover {
             background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
             border-color: rgba(255, 255, 255, 0.2);
         }
        
                 .grid {
             display: grid;
             grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
             gap: 24px;
             margin-top: 32px;
             width: 100%;
             max-width: 100%;
             overflow: hidden;
         }
         
         .grid > div {
             min-width: 0;
             overflow: hidden;
         }
        
        
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 24px;
            margin: 32px 0;
        }
        
        .stat {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 24px;
            border-radius: 16px;
            text-align: center;
            transition: var(--transition);
        }
        
        .stat:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-light);
        }
        
        .stat h3 {
            font-size: 2.5rem;
            font-weight: 700;
            background: var(--accent-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
        }
        
        .stat p {
            color: var(--text-secondary);
            font-weight: 500;
            font-size: 1.1rem;
        }
        
        .footer {
            text-align: center;
            margin-top: 60px;
            padding: 40px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: var(--border-radius);
            color: var(--text-secondary);
            box-shadow: var(--shadow-medium);
        }
        
                 .footer p {
             margin: 8px 0;
             font-size: 1.1rem;
         }
         
         .fa-heart {
             color: #e74c3c;
         }
         
         .api-url {
             background: rgba(255, 255, 255, 0.1);
             backdrop-filter: blur(10px);
             -webkit-backdrop-filter: blur(10px);
             border: 1px solid rgba(255, 255, 255, 0.2);
             padding: 12px 16px;
             border-radius: 12px;
             margin: 20px 0;
             font-size: 0.95rem;
             color: var(--text-primary);
         }
         
         .api-url code {
             background: rgba(0, 0, 0, 0.1);
             padding: 4px 8px;
             border-radius: 6px;
             font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
             font-size: 0.9rem;
             color: var(--text-accent);
         }
        
        /* Animations */
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
                 /* Responsive Design */
         @media (max-width: 1024px) {
             .container {
                 max-width: 95%;
                 padding: 20px 15px;
             }
             
             .header {
                 padding: 40px 20px;
             }
             
             .content {
                 padding: 40px 20px;
             }
             
             .grid {
                 grid-template-columns: 1fr;
                 gap: 20px;
             }
             
             .example {
                 overflow: hidden;
             }
             
             .example pre {
                 overflow-x: auto;
                 white-space: pre;
                 word-wrap: normal;
                 overflow-wrap: normal;
             }
         }
         
         @media (max-width: 768px) {
             .container {
                 padding: 15px 10px;
             }
             
             .header {
                 padding: 30px 20px;
                 margin-bottom: 20px;
             }
             
             .header h1 {
                 font-size: clamp(2rem, 6vw, 2.5rem);
             }
             
             .header p {
                 font-size: 1.1rem;
                 margin-bottom: 20px;
             }
             
             .content {
                 padding: 30px 20px;
             }
             
             .endpoint {
                 padding: 20px;
                 margin-bottom: 16px;
             }
             
             .endpoint h3 {
                 font-size: 1.25rem;
                 margin-bottom: 12px;
             }
             
             .stats {
                 grid-template-columns: 1fr;
                 gap: 16px;
                 margin: 20px 0;
             }
             
             .stat {
                 padding: 16px;
             }
             
             .stat h3 {
                 font-size: 2rem;
             }
             
             .section {
                 margin-bottom: 40px;
             }
             
             .section h2 {
                 font-size: 2rem;
                 margin-bottom: 20px;
             }
             
             .url {
                 padding: 12px;
                 font-size: 0.9rem;
                 margin: 12px 0;
             }
             
             .example {
                 padding: 16px;
                 margin: 12px 0;
                 overflow: hidden;
             }
             
             .example pre {
                 font-size: 0.85rem;
                 overflow-x: auto;
                 white-space: pre;
                 word-wrap: normal;
                 overflow-wrap: normal;
                 max-width: 100%;
             }
             
             .method {
                 padding: 4px 8px;
                 font-size: 0.75rem;
                 margin-right: 8px;
             }
         }
         
         @media (max-width: 480px) {
             .container {
                 padding: 10px 8px;
             }
             
             .header {
                 padding: 20px 15px;
                 margin-bottom: 15px;
             }
             
             .header h1 {
                 font-size: clamp(1.75rem, 8vw, 2.25rem);
                 margin-bottom: 12px;
             }
             
             .header p {
                 font-size: 1rem;
                 margin-bottom: 16px;
             }
             
             .content {
                 padding: 20px 15px;
             }
             
             .endpoint {
                 padding: 16px;
                 margin-bottom: 12px;
             }
             
             .endpoint h3 {
                 font-size: 1.1rem;
                 margin-bottom: 10px;
                 line-height: 1.4;
             }
             
             .stats {
                 grid-template-columns: 1fr;
                 gap: 12px;
                 margin: 16px 0;
             }
             
             .stat {
                 padding: 12px;
             }
             
             .stat h3 {
                 font-size: 1.75rem;
                 margin-bottom: 4px;
             }
             
             .stat p {
                 font-size: 0.95rem;
             }
             
             .section {
                 margin-bottom: 30px;
             }
             
             .section h2 {
                 font-size: 1.75rem;
                 margin-bottom: 16px;
             }
             
             .badge {
                 padding: 6px 12px;
                 font-size: 0.8rem;
                 margin: 4px;
             }
             
             .api-url {
                 padding: 10px 12px;
                 margin: 16px 0;
                 font-size: 0.85rem;
             }
             
             .api-url code {
                 font-size: 0.8rem;
                 word-break: break-all;
             }
             
             .url {
                 padding: 10px;
                 font-size: 0.85rem;
                 margin: 10px 0;
                 word-break: break-all;
                 overflow-wrap: break-word;
             }
             
             .example {
                 padding: 12px;
                 margin: 10px 0;
                 overflow: hidden;
                 width: 100%;
                 box-sizing: border-box;
             }
             
             .example pre {
                 font-size: 0.8rem;
                 line-height: 1.5;
                 overflow-x: auto;
                 white-space: pre;
                 word-wrap: normal;
                 overflow-wrap: normal;
                 max-width: 100%;
                 width: 100%;
                 box-sizing: border-box;
             }
             
             .method {
                 padding: 3px 6px;
                 font-size: 0.7rem;
                 margin-right: 6px;
             }
             
             .footer {
                 margin-top: 30px;
                 padding: 20px 15px;
             }
             
             .footer p {
                 font-size: 0.95rem;
             }
         }
         
         @media (max-width: 320px) {
             .container {
                 padding: 8px 5px;
             }
             
             .header {
                 padding: 15px 10px;
             }
             
             .content {
                 padding: 15px 10px;
             }
             
             .header h1 {
                 font-size: 1.5rem;
             }
             
             .section h2 {
                 font-size: 1.5rem;
             }
             
             .endpoint {
                 padding: 12px;
                 margin-bottom: 10px;
             }
             
             .endpoint h3 {
                 font-size: 1rem;
             }
             
             .url, .example pre {
                 font-size: 0.75rem;
             }
             
             .badge {
                 font-size: 0.75rem;
                 padding: 4px 8px;
             }
             
             .grid {
                 grid-template-columns: 1fr;
                 gap: 12px;
                 margin-top: 16px;
             }
             
             .example {
                 padding: 8px;
                 margin: 8px 0;
             }
             
             .example pre {
                 font-size: 0.7rem;
                 padding: 4px;
             }
             
             .api-url {
                 padding: 8px 10px;
                 margin: 12px 0;
                 font-size: 0.8rem;
             }
             
             .api-url code {
                 font-size: 0.75rem;
                 display: block;
                 margin-top: 4px;
                 word-break: break-all;
             }
         }
    </style>
</head>
<body>
    <div class="container">
                 <div class="header">
             <h1><i class="fas fa-book"></i> Quote API</h1>
             <p>A modern, secure, and feature-rich REST API for inspirational quotes</p>
             <div class="api-url">
                 <i class="fas fa-link"></i> <strong>API Base URL:</strong> <code>${baseUrl}</code>
             </div>
             <div class="stats">
                 <div class="stat">
                     <h3>${quotes.length}</h3>
                     <p>Total Quotes</p>
                 </div>
                 <div class="stat">
                     <h3>${process.env.API_VERSION || "v1"}</h3>
                     <p>API Version</p>
                 </div>
                 <div class="stat">
                     <h3>${
                       NODE_ENV.charAt(0).toUpperCase() + NODE_ENV.slice(1)
                     }</h3>
                     <p>Environment</p>
                 </div>
             </div>
             <div>
                 <span class="badge"><i class="fas fa-lock"></i> Rate Limited</span>
                 <span class="badge"><i class="fas fa-shield-alt"></i> Secure Headers</span>
                 <span class="badge"><i class="fas fa-chart-bar"></i> Paginated</span>
                 <span class="badge"><i class="fas fa-search"></i> Searchable</span>
             </div>
         </div>
        
        <div class="content">
                         <div class="section">
                 <h2><i class="fas fa-rocket"></i> API Endpoints</h2>
                 
                 <div class="endpoint">
                     <h3><span class="method">GET</span> <i class="fas fa-dice"></i> Random Quote</h3>
                     <div class="url">${baseUrl}${API_PREFIX}/quote/random</div>
                     <p>Get a random inspirational quote.</p>
                     <div class="example">
                         <pre id="curl-random">curl -X GET "${baseUrl}${API_PREFIX}/quote/random"</pre>
                     </div>
                 </div>
                 
                 <div class="endpoint">
                     <h3><span class="method">GET</span> <i class="fas fa-list"></i> All Quotes (Paginated)</h3>
                     <div class="url">${baseUrl}${API_PREFIX}/quotes?page=1&limit=10</div>
                     <p>Get all quotes with pagination support.</p>
                     <div class="example">
                         <pre id="curl-all">curl -X GET "${baseUrl}${API_PREFIX}/quotes?page=1&limit=10"</pre>
                     </div>
                 </div>
                 
                 <div class="endpoint">
                     <h3><span class="method">GET</span> <i class="fas fa-search"></i> Search Quotes</h3>
                     <div class="url">${baseUrl}${API_PREFIX}/quotes/search?q=success</div>
                     <p>Search quotes by content keywords.</p>
                     <div class="example">
                         <pre id="curl-search">curl -X GET "${baseUrl}${API_PREFIX}/quotes/search?q=success"</pre>
                     </div>
                 </div>
                 
                 <div class="endpoint">
                     <h3><span class="method">GET</span> <i class="fas fa-user"></i> Quotes by Author</h3>
                     <div class="url">${baseUrl}${API_PREFIX}/quotes/author/einstein</div>
                     <p>Get all quotes by a specific author.</p>
                     <div class="example">
                         <pre id="curl-author">curl -X GET "${baseUrl}${API_PREFIX}/quotes/author/einstein"</pre>
                     </div>
                 </div>
                 
                 <div class="endpoint">
                     <h3><span class="method">GET</span> <i class="fas fa-tag"></i> Quotes by Tag</h3>
                     <div class="url">${baseUrl}${API_PREFIX}/quotes/tag/motivation</div>
                     <p>Get all quotes with a specific tag.</p>
                     <div class="example">
                         <pre id="curl-tag">curl -X GET "${baseUrl}${API_PREFIX}/quotes/tag/motivation"</pre>
                     </div>
                 </div>
                 
                 <div class="endpoint">
                     <h3><span class="method">GET</span> <i class="fas fa-id-card"></i> Quote by ID</h3>
                     <div class="url">${baseUrl}${API_PREFIX}/quote/{id}</div>
                     <p>Get a specific quote by its unique ID.</p>
                     <div class="example">
                         <pre id="curl-id">curl -X GET "${baseUrl}${API_PREFIX}/quote/quote-id-123"</pre>
                     </div>
                 </div>
                 
                 <div class="endpoint">
                     <h3><span class="method">GET</span> <i class="fas fa-ruler"></i> Filter by Length</h3>
                     <div class="url">${baseUrl}${API_PREFIX}/quotes/length?min=50&max=100</div>
                     <p>Filter quotes by character length.</p>
                     <div class="example">
                         <pre id="curl-length">curl -X GET "${baseUrl}${API_PREFIX}/quotes/length?min=50&max=100"</pre>
                     </div>
                 </div>
                 
                 <div class="endpoint">
                     <h3><span class="method">GET</span> <i class="fas fa-tags"></i> All Tags</h3>
                     <div class="url">${baseUrl}${API_PREFIX}/tags</div>
                     <p>Get all available tags.</p>
                     <div class="example">
                         <pre id="curl-tags">curl -X GET "${baseUrl}${API_PREFIX}/tags"</pre>
                     </div>
                 </div>
                 
                 <div class="endpoint">
                     <h3><span class="method">GET</span> <i class="fas fa-heartbeat"></i> Health Check</h3>
                     <div class="url">${baseUrl}/health</div>
                     <p>Check API health and status.</p>
                     <div class="example">
                         <pre id="curl-health">curl -X GET "${baseUrl}/health"</pre>
                     </div>
                 </div>
             </div>
            
                         <div class="section">
                 <h2><i class="fas fa-lightbulb"></i> Usage Examples</h2>
                 
                 <div class="grid">
                     <div>
                         <h3><i class="fab fa-js-square"></i> JavaScript/Node.js</h3>
                         <div class="example">
                             <pre id="js-example">// Get a random quote
const response = await fetch('${baseUrl}${API_PREFIX}/quote/random');
const quote = await response.json();
console.log(\`"\${quote.content}" - \${quote.author}\`);

// Search for quotes
const searchResponse = await fetch('${baseUrl}${API_PREFIX}/quotes/search?q=success');
const searchResults = await searchResponse.json();
console.log(\`Found \${searchResults.total} quotes about success\`);</pre>
                         </div>
                     </div>
                     
                     <div>
                         <h3><i class="fab fa-python"></i> Python</h3>
                         <div class="example">
                             <pre id="python-example">import requests

# Get a random quote
response = requests.get('${baseUrl}${API_PREFIX}/quote/random')
quote = response.json()
print(f'"{quote["content"]}" - {quote["author"]}')

# Get quotes by author
einstein_quotes = requests.get('${baseUrl}${API_PREFIX}/quotes/author/einstein')
print(f"Found {einstein_quotes.json()['total']} Einstein quotes")</pre>
                         </div>
                     </div>
                 </div>
             </div>
             
             <div class="section">
                 <h2><i class="fas fa-chart-bar"></i> Response Format</h2>
                 <p>All API responses return JSON with the following structure:</p>
                 <div class="example">
                     <pre>{
  "_id": "quote-id-123",
  "content": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs",
  "tags": ["work", "passion", "success"],
  "length": 49,
  "dateAdded": "2023-01-01"
}</pre>
                 </div>
             </div>
             
             <div class="section">
                 <h2><i class="fas fa-lock"></i> Rate Limiting</h2>
                 <p>API calls are rate limited to <strong>${RATE_LIMIT_MAX} requests per ${
    RATE_LIMIT_WINDOW / 1000
  } seconds</strong> per IP address.</p>
                 <p>Rate limit information is included in response headers:</p>
                 <div class="example">
                     <pre>X-RateLimit-Limit: ${RATE_LIMIT_MAX}
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640995200</pre>
                 </div>
             </div>
        </div>
        
                 <div class="footer">
             <p>Built with <i class="fas fa-heart"></i> using Node.js and Express</p>
             <p>Happy coding! <i class="fas fa-rocket"></i></p>
         </div>
    </div>
    
         <script>
         // Landing page loaded
         document.addEventListener('DOMContentLoaded', function() {
             console.log('Quote API documentation loaded');
         });
     </script>
</body>
</html>
  `;

  res.send(html);
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
    results: quotes.slice(start, end),
  });
});

app.get(`${API_PREFIX}/quotes/search`, (req, res) => {
  const q = req.query.q?.toLowerCase();
  if (!q) return res.status(400).json({ error: "Missing search query" });
  const result = quotes.filter((qt) => qt.content.toLowerCase().includes(q));
  res.json({
    query: req.query.q,
    total: result.length,
    results: result,
  });
});

app.get(`${API_PREFIX}/quotes/author/:name`, (req, res) => {
  const name = req.params.name.toLowerCase();
  const result = quotes.filter((q) => q.author.toLowerCase().includes(name));
  res.json({
    author: req.params.name,
    total: result.length,
    results: result,
  });
});

app.get(`${API_PREFIX}/quotes/tag/:tag`, (req, res) => {
  const tag = req.params.tag.toLowerCase();
  const result = quotes.filter((q) =>
    q.tags.map((t) => t.toLowerCase()).includes(tag)
  );
  res.json({
    tag: req.params.tag,
    total: result.length,
    results: result,
  });
});

app.get(`${API_PREFIX}/quote/:id`, (req, res) => {
  const id = req.params.id;
  const quote = quotes.find((q) => q._id === id);
  if (!quote) return res.status(404).json({ error: "Quote not found" });
  res.json(quote);
});

app.get(`${API_PREFIX}/quotes/date/:date`, (req, res) => {
  const date = req.params.date;
  const result = quotes.filter((q) => q.dateAdded.startsWith(date));
  res.json({
    date: req.params.date,
    total: result.length,
    results: result,
  });
});

app.get(`${API_PREFIX}/tags`, (req, res) => {
  const tags = new Set();
  quotes.forEach((q) => q.tags.forEach((tag) => tags.add(tag)));
  res.json({
    total: tags.size,
    tags: [...tags].sort(),
  });
});

app.get(`${API_PREFIX}/quotes/length`, (req, res) => {
  const min = parseInt(req.query.min) || 0;
  const max = parseInt(req.query.max) || Infinity;
  const result = quotes.filter((q) => q.length >= min && q.length <= max);
  res.json({
    filter: { min, max: max === Infinity ? "unlimited" : max },
    total: result.length,
    results: result,
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: process.env.API_VERSION || "v1",
  });
});

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `The requested route ${req.method} ${req.originalUrl} does not exist.`,
    availableRoutes: [
      "GET /",
      `GET ${API_PREFIX}/quote/random`,
      `GET ${API_PREFIX}/quotes`,
      `GET ${API_PREFIX}/quotes/search`,
      `GET ${API_PREFIX}/quotes/author/:name`,
      `GET ${API_PREFIX}/quotes/tag/:tag`,
      `GET ${API_PREFIX}/quote/:id`,
      `GET ${API_PREFIX}/quotes/date/:date`,
      `GET ${API_PREFIX}/quotes/length`,
      `GET ${API_PREFIX}/tags`,
      "GET /health",
    ],
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
  res.status(500).json({
    error: "Internal server error",
    message: NODE_ENV === "development" ? err.message : "Something went wrong!",
  });
});

app.listen(PORT, () => {
  console.log(
    `🚀 Quote API v${
      process.env.API_VERSION || "v1"
    } running at http://localhost:${PORT}`
  );
  console.log(`📊 Environment: ${NODE_ENV}`);
  console.log(
    `🔒 Rate Limit: ${RATE_LIMIT_MAX} requests per ${
      RATE_LIMIT_WINDOW / 1000
    } seconds`
  );
  console.log(
    `🛡️  Security Headers: ${HELMET_ENABLED ? "Enabled" : "Disabled"}`
  );
  console.log(`🐛 Debug Mode: ${DEBUG ? "Enabled" : "Disabled"}`);
  console.log(`📚 Total Quotes: ${quotes.length}`);
  if (DEBUG) {
    console.log(`🔍 API Endpoints: ${API_PREFIX}/*`);
  }
});
