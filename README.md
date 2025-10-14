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
```bash
# Copy the example .env file in backend directory
cp backend/.env.example backend/.env
# Edit the .env file with your configuration
```

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

## 📱 Features

- 🎨 Modern, responsive design
- ⚡ Lightning-fast Vite development
- 🔒 TypeScript for type safety
- 🛡️ Security middleware with Helmet
- 🌐 CORS configured for cross-origin requests
- 📝 Request logging with Morgan
- 🔄 Hot reload for both frontend and backend
- 📧 Contact form API endpoint
- 💼 Portfolio data management

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

## 🚀 Next Steps

- [ ] Add database integration (MongoDB/PostgreSQL)
- [ ] Implement authentication
- [ ] Add file upload for images
- [ ] Create admin panel
- [ ] Add email service for contact form
- [ ] Deploy to production (Vercel/Netlify + Railway/Render)
- [ ] Add testing (Jest/Vitest)
- [ ] Add CI/CD pipeline

## 📄 License

MIT License - feel free to use this project as a starting point for your own portfolio!
