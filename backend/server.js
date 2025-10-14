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
  // This could be connected to a database in the future
  res.json([
    {
      id: 1,
      title: 'Portfolio Website',
      description: 'A modern, responsive portfolio website',
      technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'Vite'],
      github: 'https://github.com/yourusername/portfolio',
      demo: 'https://yourportfolio.com'
    }
  ]);
});

// Contact form endpoint (placeholder)
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  // In a real application, you would save this to a database or send an email
  console.log('Contact form submission:', { name, email, message });
  
  res.json({ 
    success: true, 
    message: 'Thank you for your message! I will get back to you soon.' 
  });
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
