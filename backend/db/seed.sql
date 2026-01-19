-- Seed data for portfolio database

-- Insert contact info (your personal information)
INSERT INTO contact_info (name, title, bio, email, phone, linkedin, github, website, skills)
VALUES (
    'Your Name',
    'Full Stack Developer',
    'Passionate developer with experience in modern web technologies including React, Node.js, and cloud platforms.',
    'your.email@example.com',
    '+1 (555) 123-4567',
    'https://linkedin.com/in/yourprofile',
    'https://github.com/yourusername',
    'https://yourwebsite.com',
    ARRAY['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'Tailwind CSS']
)
ON CONFLICT DO NOTHING;

-- Insert experience
INSERT INTO experience (company, position, duration, description, order_index)
VALUES 
    ('Tech Company', 'Senior Full Stack Developer', '2022 - Present', 'Led development of scalable web applications using React and Node.js', 1),
    ('Startup Inc.', 'Frontend Developer', '2020 - 2022', 'Built responsive user interfaces and improved user experience', 2)
ON CONFLICT DO NOTHING;

-- Insert projects
INSERT INTO projects (title, description, technologies, github, demo, image, category, featured, status, created_at)
VALUES 
    (
        'E-Commerce Platform',
        'A full-stack e-commerce solution with modern payment integration, inventory management, and responsive design.',
        ARRAY['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Docker'],
        'https://github.com/yourusername/ecommerce',
        'https://ecommerce-demo.com',
        '/api/placeholder/400/300',
        'Full Stack',
        true,
        'Completed',
        '2024-01-15'
    ),
    (
        'Task Management App',
        'Collaborative task management application with real-time updates, team collaboration features, and advanced project tracking.',
        ARRAY['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'Redis', 'JWT'],
        'https://github.com/yourusername/taskmanager',
        'https://taskmanager-demo.com',
        '/api/placeholder/400/300',
        'Web App',
        true,
        'Completed',
        '2024-02-20'
    ),
    (
        'Weather Analytics Dashboard',
        'Interactive dashboard for weather data visualization with charts, maps, and predictive analytics using machine learning.',
        ARRAY['React', 'D3.js', 'Python', 'Flask', 'PostgreSQL', 'Chart.js'],
        'https://github.com/yourusername/weather',
        'https://weather-analytics.com',
        '/api/placeholder/400/300',
        'Data Visualization',
        false,
        'Completed',
        '2024-03-10'
    ),
    (
        'Social Media API',
        'RESTful API for social media platform with authentication, real-time messaging, and content management.',
        ARRAY['Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT', 'Cloudinary'],
        'https://github.com/yourusername/social-api',
        NULL,
        '/api/placeholder/400/300',
        'Backend',
        false,
        'In Progress',
        '2024-04-05'
    ),
    (
        'Portfolio Website',
        'Modern, responsive portfolio website built with React and Material-UI, featuring dark mode and smooth animations.',
        ARRAY['React', 'TypeScript', 'Material-UI', 'Vite', 'Node.js'],
        'https://github.com/yourusername/portfolio',
        'https://yourportfolio.com',
        '/api/placeholder/400/300',
        'Frontend',
        true,
        'Completed',
        '2024-05-01'
    ),
    (
        'Cryptocurrency Tracker',
        'Real-time cryptocurrency price tracker with portfolio management, alerts, and market analysis.',
        ARRAY['React', 'Node.js', 'WebSocket', 'Chart.js', 'CoinGecko API'],
        'https://github.com/yourusername/crypto',
        'https://crypto-tracker.com',
        '/api/placeholder/400/300',
        'Web App',
        false,
        'Completed',
        '2024-06-15'
    )
ON CONFLICT DO NOTHING;

-- Insert blogs (note: pdf_path is NULL for now, will be added when PDFs are uploaded)
INSERT INTO blogs (title, excerpt, content, pdf_path, author, published_at, read_time, tags, featured, image, category, views, likes)
VALUES 
    (
        'Building Scalable React Applications',
        'Learn best practices for structuring and scaling React applications for production use.',
        'In this comprehensive guide, we explore the essential patterns and practices for building scalable React applications...',
        NULL,
        'Your Name',
        '2024-01-20',
        '8 min read',
        ARRAY['React', 'JavaScript', 'Architecture', 'Performance'],
        true,
        '/api/placeholder/600/400',
        'Frontend Development',
        1250,
        89
    ),
    (
        'Mastering TypeScript in 2024',
        'A deep dive into advanced TypeScript features and how they improve code quality and developer experience.',
        'TypeScript has revolutionized JavaScript development by adding static typing...',
        NULL,
        'Your Name',
        '2024-02-15',
        '12 min read',
        ARRAY['TypeScript', 'JavaScript', 'Programming', 'Best Practices'],
        true,
        '/api/placeholder/600/400',
        'Programming Languages',
        980,
        67
    ),
    (
        'Node.js Performance Optimization',
        'Techniques and strategies for optimizing Node.js applications for better performance and scalability.',
        'Performance is crucial for any production application. In this article, we cover various optimization techniques...',
        NULL,
        'Your Name',
        '2024-03-05',
        '10 min read',
        ARRAY['Node.js', 'Performance', 'Backend', 'Optimization'],
        false,
        '/api/placeholder/600/400',
        'Backend Development',
        756,
        45
    ),
    (
        'Database Design Patterns',
        'Exploring common database design patterns and when to use them in modern applications.',
        'Database design is fundamental to application architecture. This post covers essential patterns...',
        NULL,
        'Your Name',
        '2024-04-12',
        '15 min read',
        ARRAY['Database', 'MongoDB', 'PostgreSQL', 'Design Patterns'],
        false,
        '/api/placeholder/600/400',
        'Database',
        623,
        38
    ),
    (
        'Modern CSS Techniques',
        'Discover the latest CSS features and techniques for creating beautiful, responsive web interfaces.',
        'CSS continues to evolve with new features that make styling more powerful and intuitive...',
        NULL,
        'Your Name',
        '2024-05-08',
        '6 min read',
        ARRAY['CSS', 'Frontend', 'Responsive Design', 'Web Design'],
        true,
        '/api/placeholder/600/400',
        'Web Design',
        892,
        71
    ),
    (
        'DevOps Best Practices',
        'Essential DevOps practices for continuous integration, deployment, and monitoring.',
        'DevOps practices are essential for modern software development. This guide covers the fundamentals...',
        NULL,
        'Your Name',
        '2024-06-20',
        '11 min read',
        ARRAY['DevOps', 'CI/CD', 'Docker', 'Monitoring'],
        false,
        '/api/placeholder/600/400',
        'DevOps',
        534,
        29
    )
ON CONFLICT DO NOTHING;
