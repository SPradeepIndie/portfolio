/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import projectController from './controllers/projectController.js';
import blogController from './controllers/blogController.js';
import contactController from './controllers/contactController.js';
import portfolioController from './controllers/portfolioController.js';
import authController from './controllers/authController.js';
import userController from './controllers/userController.js';
import pdfController from './controllers/pdfController.js';
import settingsController from './controllers/settingsController.js';
import swaggerDocument from './api/swagger.js';

// Import error handling middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import rate limiters
import { globalLimiter, authLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Trust the first proxy (e.g. Nginx or Azure Container Apps) so rate limiting works accurately
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Portfolio API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Apply global rate limiter to all /api routes
app.use('/api', globalLimiter);

// API Routes
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api/docs-json', (req, res) => {
  res.json(swaggerDocument);
});
app.use('/api/portfolio', portfolioController);
app.use('/api/projects', projectController);
app.use('/api/blogs', blogController);
app.use('/api/contact', contactController);
app.use('/api/auth', authLimiter, authController);
app.use('/api/admin/users', userController);
app.use('/api/admin/pdfs', pdfController);
app.use('/api/settings', settingsController);

// Placeholder image endpoint
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f2f5"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" 
            fill="#6b7280" text-anchor="middle" dy=".3em">
        ${width} × ${height}
      </text>
    </svg>
  `;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.send(svg);
});

// 404 handler - must be after all routes
app.use(notFound);

// Error handling middleware - must be last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📖 API Health: http://localhost:${PORT}/api/health`);
  console.log(`📝 Portfolio Data: http://localhost:${PORT}/api/portfolio`);
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api/docs`);
});
