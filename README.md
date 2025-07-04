<div align="center">

# 📚 Quote API

*A modern, secure, and feature-rich REST API for inspirational quotes*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-blue.svg)](https://expressjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Tunnel-orange.svg)](https://www.cloudflare.com/)

[Features](#-features) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Configuration](#-configuration) • [Docker](#-docker-deployment)

</div>

---

## ✨ Features

<div align="center">
<table>
<tr>
<td>

### 🎯 **Core Features**
- 🎲 Random quote generation
- 🔍 Advanced search capabilities
- 🏷️ Tag-based filtering
- 📅 Date-based queries
- 📏 Length filtering
- 👤 Author-based search

</td>
<td>

### 🛠️ **Technical Features**
- ⚙️ Environment configuration
- 🏥 Health monitoring
- 🐛 Debug mode
- 🎨 Pretty JSON responses
- 📝 Enhanced response objects
- 🔒 Security-first design

</td>
</tr>
<tr>
<td>

### 🚀 **Deployment**
- 🐳 Docker ready
- ☁️ Cloudflare tunnel integration
- 📊 Pagination support
- 🔄 Hot reload for development

</td>
<td>

### 🔒 **Security**
- 🛡️ Rate limiting
- 🔐 Secure headers
- 🚫 Input validation
- 🌐 CORS protection
- 🔒 Environment-based security

</td>
</tr>
</table>
</div>

---

## 🚀 Quick Start

### Prerequisites

![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)
![npm](https://img.shields.io/badge/npm-latest-red?style=flat-square&logo=npm)
![Docker](https://img.shields.io/badge/Docker-optional-blue?style=flat-square&logo=docker)

### Installation

```bash
# 1️⃣ Clone the repository
git clone <repository-url>
cd quote-api

# 2️⃣ Install dependencies
npm install

# 3️⃣ Set up environment variables
cp .env.example .env
# Edit .env file with your preferred settings

# 4️⃣ Start the development server
npm start

# 🎉 Your API is now running at http://localhost:3000
```

### Alternative: One-liner setup
```bash
git clone <repository-url> && cd quote-api && npm install && cp .env.example .env && npm start
```

---

## 🐳 Docker Deployment

<details>
<summary><strong>🔧 Using Docker Compose (Recommended)</strong></summary>

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f quote-api

# Stop services
docker-compose down
```

</details>

<details>
<summary><strong>📦 Manual Docker Build</strong></summary>

```bash
# Build the image
docker build -t quote-api .

# Run the container
docker run -p 3000:3000 --env-file .env quote-api
```

</details>

---

## 📖 API Documentation

### 🌐 Base URL
```
http://localhost:3000/api
```

> **💡 Pro Tip:** The API prefix is configurable via the `API_PREFIX` environment variable (default: `/api`)

### 📋 Endpoints Overview

<div align="center">
<table>
<tr>
<th>Category</th>
<th>Endpoint</th>
<th>Description</th>
<th>Example</th>
</tr>
<tr>
<td rowspan="2">🎲 <strong>Random</strong></td>
<td><code>GET /api/quote/random</code></td>
<td>Get a random quote</td>
<td><a href="#-random-quote">View</a></td>
</tr>
<tr>
<td><code>GET /api/quotes</code></td>
<td>Get all quotes (paginated)</td>
<td><a href="#-get-all-quotes">View</a></td>
</tr>
<tr>
<td rowspan="3">🔍 <strong>Search</strong></td>
<td><code>GET /api/quotes/search</code></td>
<td>Search quotes by content</td>
<td><a href="#-search-quotes">View</a></td>
</tr>
<tr>
<td><code>GET /api/quotes/author/:name</code></td>
<td>Get quotes by author</td>
<td><a href="#-quotes-by-author">View</a></td>
</tr>
<tr>
<td><code>GET /api/quotes/tag/:tag</code></td>
<td>Get quotes by tag</td>
<td><a href="#-quotes-by-tag">View</a></td>
</tr>
<tr>
<td rowspan="3">📊 <strong>Filter</strong></td>
<td><code>GET /api/quotes/date/:date</code></td>
<td>Get quotes by date</td>
<td><a href="#-quotes-by-date">View</a></td>
</tr>
<tr>
<td><code>GET /api/quotes/length</code></td>
<td>Filter by character length</td>
<td><a href="#-filter-by-length">View</a></td>
</tr>
<tr>
<td><code>GET /api/quote/:id</code></td>
<td>Get specific quote by ID</td>
<td><a href="#-get-quote-by-id">View</a></td>
</tr>
<tr>
<td rowspan="2">🏷️ <strong>Meta</strong></td>
<td><code>GET /api/tags</code></td>
<td>Get all available tags</td>
<td><a href="#-get-all-tags">View</a></td>
</tr>
<tr>
<td><code>GET /health</code></td>
<td>Health check endpoint</td>
<td><a href="#-health-check">View</a></td>
</tr>
</table>
</div>

---

### 🔍 Detailed Endpoint Documentation

#### 🎲 Random Quote
```http
GET /api/quote/random
```

<details>
<summary><strong>📝 Response Example</strong></summary>

```json
{
  "_id": "quote-id-123",
  "content": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs",
  "tags": ["work", "passion", "success"],
  "length": 49,
  "dateAdded": "2023-01-01"
}
```

</details>

#### 📚 Get All Quotes
```http
GET /api/quotes?page=1&limit=10
```

**Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of quotes per page (default: all)

<details>
<summary><strong>📝 Response Example</strong></summary>

```json
{
  "page": 1,
  "limit": 10,
  "total": 100,
  "results": [
    {
      "_id": "quote-id-123",
      "content": "Quote content here...",
      "author": "Author Name",
      "tags": ["tag1", "tag2"],
      "length": 50,
      "dateAdded": "2023-01-01"
    }
  ]
}
```

</details>

#### 🔍 Search Quotes
```http
GET /api/quotes/search?q=success
```

**Parameters:**
- `q` (required): Search query

<details>
<summary><strong>📝 Response Example</strong></summary>

```json
{
  "query": "success",
  "total": 15,
  "results": [...]
}
```

</details>

#### 👤 Quotes by Author
```http
GET /api/quotes/author/steve-jobs
```

#### 🏷️ Quotes by Tag
```http
GET /api/quotes/tag/motivation
```

#### 🆔 Get Quote by ID
```http
GET /api/quote/{id}
```

#### 📅 Quotes by Date
```http
GET /api/quotes/date/2023-01-01
```

#### 📏 Filter by Length
```http
GET /api/quotes/length?min=50&max=100
```

**Parameters:**
- `min` (optional): Minimum character length
- `max` (optional): Maximum character length

#### 🏷️ Get All Tags
```http
GET /api/tags
```

<details>
<summary><strong>📝 Response Example</strong></summary>

```json
{
  "total": 25,
  "tags": ["inspiration", "motivation", "success", "wisdom", "life"]
}
```

</details>

#### 🏥 Health Check
```http
GET /health
```

<details>
<summary><strong>📝 Response Example</strong></summary>

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "v1"
}
```

</details>

---

## ⚙️ Configuration

### 🔧 Environment Variables

<details>
<summary><strong>📋 View All Environment Variables</strong></summary>

Copy the `.env.example` file to `.env` and customize the values:

```bash
cp .env.example .env
```

**Available Environment Variables:**

```env
# 🖥️ Server Configuration
PORT=3000                    # Server port
NODE_ENV=development         # Environment mode (development/production)

# 🔒 Rate Limiting Configuration
RATE_LIMIT_WINDOW=60000     # Rate limit window in milliseconds
RATE_LIMIT_MAX=60           # Maximum requests per window

# 🛡️ Security Headers
HELMET_ENABLED=true         # Enable/disable security headers

# 🌐 CORS Configuration
CORS_ORIGIN=*               # Allowed origins
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With

# 📡 API Configuration
API_VERSION=v1              # API version for display
API_PREFIX=/api             # API route prefix

# 🛠️ Development Tools
DEBUG=false                 # Enable debug logging
PRETTY_PRINT_JSON=true      # Pretty print JSON in development

# 📊 Monitoring
HEALTH_CHECK_ENABLED=true   # Enable health check endpoint
METRICS_ENABLED=false       # Enable metrics collection
```

</details>

### 🔒 Security Features

<div align="center">
<table>
<tr>
<td>

**🛡️ Built-in Security**
- Rate limiting (configurable)
- Secure headers via Helmet.js
- Input validation
- CORS protection
- No information leakage

</td>
<td>

**⚙️ Configurable Security**
- Environment-based toggles
- Flexible rate limiting
- Custom CORS policies
- Debug mode controls
- Production optimizations

</td>
</tr>
</table>
</div>

### 🛠️ Development Features

<div align="center">
<table>
<tr>
<td>

**🐛 Debug & Testing**
- Debug mode logging
- Pretty JSON formatting
- Environment awareness
- Hot reload support
- Health monitoring

</td>
<td>

**📊 Monitoring**
- Built-in health checks
- Process monitoring
- Environment info
- Enhanced error messages
- Rate limit headers

</td>
</tr>
</table>
</div>

---

## 🌐 Cloudflare Tunnel Setup

<details>
<summary><strong>☁️ Configure Cloudflare Tunnel</strong></summary>

1. **Configure your tunnel in `cloudflared/config.yml`**
2. **Update `docker-compose.yml` with your tunnel ID**
3. **Deploy with Docker Compose**

```bash
docker-compose up -d
```

</details>

## 🏡 Home Server Deployment (Self-Hosting)

<details>
<summary><strong>⚙️ Deploy from Your Home PC using Docker + Cloudflare Tunnel</strong></summary>

### 🔧 Requirements

- Ubuntu/Linux-based home server
- Docker + Docker Compose
- Cloudflared installed and authenticated
- Cloudflare DNS set up with your domain (e.g., quotes.dhruvchheda.com)

### 📁 Folder Structure

```bash
quote-stack/
├── quote-api/                   # Express API source
├── cloudflared/
│   ├── config.yml               # Tunnel configuration
│   └── quote-api-tunnel.json    # Tunnel credentials
└── docker-compose.yml          # Service orchestration
```

### 📝 cloudflared/config.yml

```yaml
tunnel: <your-tunnel-id>
credentials-file: /etc/cloudflared/quote-api-tunnel.json

ingress:
  - hostname: <your-domain>
    service: http://quote-api:3000
  - service: http_status:404
```

### 🚀 Deploy

```bash
docker-compose up -d
```

✅ **Your API will be available publicly at:**
https://<your-domain>

### 🔄 Auto-Start on Reboot (Optional)

Enable automatic startup of Docker and cloudflared on server reboot:

```bash
sudo systemctl enable docker
sudo systemctl enable cloudflared
```

</details>

---

## 📁 Project Structure

```
quote-api/
├── 📄 index.js              # Main application file
├── 📊 quotes.json           # Quote database
├── 🐳 Dockerfile            # Docker configuration
├── 🐳 docker-compose.yml    # Multi-service setup
├── 📦 package.json          # Dependencies
├── 📚 README.md            # Documentation
├── 🔧 .env.example         # Environment variables template
├── 🔧 .env                 # Environment variables (local)
└── 🚫 .gitignore           # Git ignore rules
```

---

## 🚀 Available Scripts

```bash
# 🎯 Production
npm start              # Start the production server

# 🛠️ Development
npm run dev            # Start development server with hot reload

# 🧪 Testing
npm test              # Run tests (to be implemented)
```

---

## 💡 Usage Examples

<details>
<summary><strong>🟨 JavaScript/Node.js</strong></summary>

```javascript
// Get a random quote
const response = await fetch('http://localhost:3000/api/quote/random');
const quote = await response.json();
console.log(`"${quote.content}" - ${quote.author}`);

// Search for quotes
const searchResponse = await fetch('http://localhost:3000/api/quotes/search?q=success');
const searchResults = await searchResponse.json();
console.log(`Found ${searchResults.total} quotes about success`);
```

</details>

<details>
<summary><strong>🐍 Python</strong></summary>

```python
import requests

# Get a random quote
response = requests.get('http://localhost:3000/api/quote/random')
quote = response.json()
print(f'"{quote["content"]}" - {quote["author"]}')

# Get quotes by author
einstein_quotes = requests.get('http://localhost:3000/api/quotes/author/einstein')
print(f"Found {einstein_quotes.json()['total']} Einstein quotes")
```

</details>

<details>
<summary><strong>📡 cURL</strong></summary>

```bash
# Get a random quote
curl -X GET http://localhost:3000/api/quote/random

# Search quotes with pretty output
curl -X GET "http://localhost:3000/api/quotes/search?q=motivation" | jq

# Get health status
curl -X GET http://localhost:3000/health
```

</details>

---

## 🚀 Performance & Monitoring

<div align="center">
<table>
<tr>
<td>

**⚡ Performance**
- Fast response times
- Memory efficient
- Scalable architecture
- Docker-ready deployment

</td>
<td>

**📊 Monitoring**
- Health check endpoint
- Debug mode logging
- Rate limit headers
- Environment info
- Process monitoring

</td>
</tr>
</table>
</div>

### 📈 Monitoring Commands

```bash
# View Docker logs
docker-compose logs -f

# Check health status
curl http://localhost:3000/health

# Monitor in debug mode
DEBUG=true npm start
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **🍴 Fork** the repository
2. **🌟 Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **📝 Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **🚀 Push** to the branch (`git push origin feature/amazing-feature`)
5. **🔄 Open** a Pull Request

### 📋 Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Use meaningful commit messages

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Express.js** - Fast, unopinionated web framework
- **Helmet.js** - Security middleware
- **Docker** - Containerization platform
- **Cloudflare** - CDN and security services

---

<div align="center">

### 🌟 **Star this repository if you find it helpful!**

**Built with ❤️ using Node.js and Express**

*Happy coding! 🚀*

</div> 