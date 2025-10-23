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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Portfolio API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Portfolio data endpoint
app.get('/api/portfolio', (req, res) => {
  res.json({
    name: 'Your Name',
    title: 'Full Stack Developer',
    bio: 'Passionate developer with experience in modern web technologies including React, Node.js, and cloud platforms.',
    skills: [
      'React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 
      'PostgreSQL', 'Docker', 'AWS', 'Git', 'Tailwind CSS'
    ],
    projects: [
      {
        id: 1,
        title: 'Portfolio Website',
        description: 'A modern, responsive portfolio website built with React, TypeScript, and Node.js',
        technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'Vite'],
        github: 'https://github.com/yourusername/portfolio',
        demo: 'https://yourportfolio.com',
        image: '/api/placeholder/400/300'
      },
      {
        id: 2,
        title: 'E-commerce Platform',
        description: 'Full-stack e-commerce solution with payment integration',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Docker'],
        github: 'https://github.com/yourusername/ecommerce',
        demo: 'https://yourecommerce.com',
        image: '/api/placeholder/400/300'
      }
    ],
    contact: {
      email: 'your.email@example.com',
      phone: '+1 (555) 123-4567',
      linkedin: 'https://linkedin.com/in/yourprofile',
      github: 'https://github.com/yourusername',
      website: 'https://yourwebsite.com'
    },
    experience: [
      {
        id: 1,
        company: 'Tech Company',
        position: 'Senior Full Stack Developer',
        duration: '2022 - Present',
        description: 'Led development of scalable web applications using React and Node.js'
      },
      {
        id: 2,
        company: 'Startup Inc.',
        position: 'Frontend Developer',
        duration: '2020 - 2022',
        description: 'Built responsive user interfaces and improved user experience'
      }
    ]
  });
});

// Projects endpoint
app.get('/api/projects', (req, res) => {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with modern payment integration, inventory management, and responsive design.',
      technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Docker'],
      github: 'https://github.com/yourusername/ecommerce-platform',
      demo: 'https://ecommerce-demo.com',
      image: '/api/placeholder/400/300',
      category: 'Full Stack',
      featured: true,
      createdAt: '2024-01-15',
      status: 'Completed'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Collaborative task management application with real-time updates, team collaboration features, and advanced project tracking.',
      technologies: ['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'Redis', 'JWT'],
      github: 'https://github.com/yourusername/task-manager',
      demo: 'https://taskmanager-demo.com',
      image: '/api/placeholder/400/300',
      category: 'Web App',
      featured: true,
      createdAt: '2024-02-20',
      status: 'Completed'
    },
    {
      id: 3,
      title: 'Weather Analytics Dashboard',
      description: 'Interactive dashboard for weather data visualization with charts, maps, and predictive analytics using machine learning.',
      technologies: ['React', 'D3.js', 'Python', 'Flask', 'PostgreSQL', 'Chart.js'],
      github: 'https://github.com/yourusername/weather-dashboard',
      demo: 'https://weather-analytics.com',
      image: '/api/placeholder/400/300',
      category: 'Data Visualization',
      featured: false,
      createdAt: '2024-03-10',
      status: 'Completed'
    },
    {
      id: 4,
      title: 'Social Media API',
      description: 'RESTful API for social media platform with authentication, real-time messaging, and content management.',
      technologies: ['Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT', 'Cloudinary'],
      github: 'https://github.com/yourusername/social-api',
      demo: null,
      image: '/api/placeholder/400/300',
      category: 'Backend',
      featured: false,
      createdAt: '2024-04-05',
      status: 'In Progress'
    },
    {
      id: 5,
      title: 'Portfolio Website',
      description: 'Modern, responsive portfolio website built with React and Material-UI, featuring dark mode and smooth animations.',
      technologies: ['React', 'TypeScript', 'Material-UI', 'Vite', 'Node.js'],
      github: 'https://github.com/yourusername/portfolio',
      demo: 'https://yourportfolio.com',
      image: '/api/placeholder/400/300',
      category: 'Frontend',
      featured: true,
      createdAt: '2024-05-01',
      status: 'Completed'
    },
    {
      id: 6,
      title: 'Cryptocurrency Tracker',
      description: 'Real-time cryptocurrency price tracker with portfolio management, alerts, and market analysis.',
      technologies: ['React', 'Node.js', 'WebSocket', 'Chart.js', 'CoinGecko API'],
      github: 'https://github.com/yourusername/crypto-tracker',
      demo: 'https://crypto-tracker-demo.com',
      image: '/api/placeholder/400/300',
      category: 'Web App',
      featured: false,
      createdAt: '2024-06-15',
      status: 'Completed'
    }
  ];
  
  res.json({
    success: true,
    data: projects,
    total: projects.length
  });
});

// Blogs endpoint
app.get('/api/blogs', (req, res) => {
  const blogs = [
    {
      id: 1,
      title: 'Building Scalable React Applications',
      excerpt: 'Learn best practices for structuring and scaling React applications for production use.',
      content: 'In this comprehensive guide, we explore the essential patterns and practices for building scalable React applications...',
      author: 'Your Name',
      publishedAt: '2024-01-20',
      readTime: '8 min read',
      tags: ['React', 'JavaScript', 'Architecture', 'Performance'],
      featured: true,
      image: '/api/placeholder/600/400',
      category: 'Frontend Development',
      views: 1250,
      likes: 89
    },
    {
      id: 2,
      title: 'Mastering TypeScript in 2024',
      excerpt: 'A deep dive into advanced TypeScript features and how they improve code quality and developer experience.',
      content: 'TypeScript has revolutionized JavaScript development by adding static typing...',
      author: 'Your Name',
      publishedAt: '2024-02-15',
      readTime: '12 min read',
      tags: ['TypeScript', 'JavaScript', 'Programming', 'Best Practices'],
      featured: true,
      image: '/api/placeholder/600/400',
      category: 'Programming Languages',
      views: 980,
      likes: 67
    },
    {
      id: 3,
      title: 'Node.js Performance Optimization',
      excerpt: 'Techniques and strategies for optimizing Node.js applications for better performance and scalability.',
      content: 'Performance is crucial for any production application. In this article, we cover various optimization techniques...',
      author: 'Your Name',
      publishedAt: '2024-03-05',
      readTime: '10 min read',
      tags: ['Node.js', 'Performance', 'Backend', 'Optimization'],
      featured: false,
      image: '/api/placeholder/600/400',
      category: 'Backend Development',
      views: 756,
      likes: 45
    },
    {
      id: 4,
      title: 'Database Design Patterns',
      excerpt: 'Exploring common database design patterns and when to use them in modern applications.',
      content: 'Database design is fundamental to application architecture. This post covers essential patterns...',
      author: 'Your Name',
      publishedAt: '2024-04-12',
      readTime: '15 min read',
      tags: ['Database', 'MongoDB', 'PostgreSQL', 'Design Patterns'],
      featured: false,
      image: '/api/placeholder/600/400',
      category: 'Database',
      views: 623,
      likes: 38
    },
    {
      id: 5,
      title: 'Modern CSS Techniques',
      excerpt: 'Discover the latest CSS features and techniques for creating beautiful, responsive web interfaces.',
      content: 'CSS continues to evolve with new features that make styling more powerful and intuitive...',
      author: 'Your Name',
      publishedAt: '2024-05-08',
      readTime: '6 min read',
      tags: ['CSS', 'Frontend', 'Responsive Design', 'Web Design'],
      featured: true,
      image: '/api/placeholder/600/400',
      category: 'Web Design',
      views: 892,
      likes: 71
    },
    {
      id: 6,
      title: 'DevOps Best Practices',
      excerpt: 'Essential DevOps practices for continuous integration, deployment, and monitoring.',
      content: 'DevOps practices are essential for modern software development. This guide covers the fundamentals...',
      author: 'Your Name',
      publishedAt: '2024-06-20',
      readTime: '11 min read',
      tags: ['DevOps', 'CI/CD', 'Docker', 'Monitoring'],
      featured: false,
      image: '/api/placeholder/600/400',
      category: 'DevOps',
      views: 534,
      likes: 29
    }
  ];

  res.json({
    success: true,
    data: blogs,
    total: blogs.length
  });
});

// Contact form endpoint (placeholder)
// Contact endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  // Here you would typically save to database and/or send email
  console.log('Contact form submission:', { name, email, message });
  
  res.json({
    success: true,
    message: 'Thank you for your message! I\'ll get back to you soon.'
  });
});

// Placeholder image endpoint
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  
  // Generate a simple SVG placeholder
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📖 API Health: http://localhost:${PORT}/api/health`);
  console.log(`📝 Portfolio Data: http://localhost:${PORT}/api/portfolio`);
});
