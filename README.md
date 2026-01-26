# Portfolio Project

A modern, full-stack portfolio website built with React, TypeScript, Vite frontend and Node.js Express backend.

## 🚀 Tech Stack

### Frontend
- **React 19** - Latest React with modern features
- **TypeScript** - Type safety and better developer experience  
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and formatting

### Backend
- **Node.js v24.10.0** - Latest stable Node.js
- **Express.js v5** - Web application framework
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Nodemon** - Development auto-restart

## 📁 Project Structure

```
portfolio/
├── frontend/          # React TypeScript Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   ├── public/
│   └── package.json
├── backend/           # Node.js Express API
│   ├── server.js      # Main server file
│   ├── .env           # Environment variables
│   └── package.json
└── README.md
```

## 🛠️ Development Setup

### Prerequisites
- **Node.js v24.10.0** (latest stable)
- **npm v11.6.1** (comes with Node.js)

### Installation & Running

```bash
git clone <your-repo-url>
cd portfolio
```

2. **Install Frontend Dependencies:**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies:**
```bash
cd backend
npm install
```

4. **Set up Environment Variables:**
- For backend Create .env files for the backend
- WHen deploying create the .env file in the root by overriding the values

5. **Start Development Servers:**

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

## 🚀 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/portfolio` | Complete portfolio data |
| GET | `/api/projects` | Projects list |
| POST | `/api/contact` | Contact form submission |


## 🔧 Node Version Management

This project uses **Node.js v24.10.0**. If you need to switch between versions:

```bash
# Install and use latest stable
nvm install node
nvm use node

# Set as default
nvm alias default node

# Check current version
node --version
npm --version
```

## Services Overview

### Database (PostgreSQL)
- **Image**: postgres:16-alpine
- **Port**: 5432
- **Volume**: postgres_data (persistent storage)
- **Init Scripts**: Automatically runs schema.sql and seed.sql

### Backend (Node.js/Express)
- **Base Image**: node:20-alpine
- **Port**: 5000
- **Volume**: ./backend/uploads (for file uploads)
- **Health Check**: GET /api/health

### Frontend (React/Vite + Nginx)
- **Build Stage**: node:20-alpine
- **Serve Stage**: nginx:alpine
- **Port**: 80
- **Features**: React Router support, static asset caching, API proxy

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| DB_USER | portfolio_user | PostgreSQL username |
| DB_PASSWORD | portfolio_password | PostgreSQL password |
| DB_NAME | portfolio | Database name |
| DB_PORT | 5432 | Database port |
| BACKEND_PORT | 5000 | Backend API port |
| FRONTEND_PORT | 80 | Frontend web port |
| FRONTEND_URL | http://localhost:80 | Frontend URL for CORS |

### Nginx SSL Configuration (Production)

Update `frontend/nginx.conf` to include SSL:

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    # ... rest of configuration
}
```

### Multi-stage builds
- Frontend uses multi-stage build (build + serve)
- Reduces final image size significantly

### Layer caching
- Dependencies are installed before copying source code
- Speeds up rebuilds when only code changes

### Production dependencies only
- Backend installs only production dependencies (`npm ci --only=production`)

## Monitoring

### Health Checks

```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' portfolio-backend
docker inspect --format='{{.State.Health.Status}}' portfolio-frontend
```

### Resource Usage

```bash
# View resource usage
docker stats

# View disk usage
docker system df
```

## 📄 License

Apache License Version 2.0, January 2004
