# Portfolio Backend Setup Guide

## Architecture Overview

This is a **read-only portfolio backend** following MVC + Service architecture where:
- **Frontend**: Only uses GET endpoints to display data
- **Data Management**: Done manually through API calls (Postman/curl) or direct SQL
- **File Storage**: PDFs stored in `/uploads/blogs/` directory, database stores only file paths
- **No Admin UI**: All content management is done outside the frontend

### Project Structure
```
backend/
├── server.js                    # Application entry point
├── config/
│   └── db.js                    # Database connection pool
├── controllers/                 # HTTP routing layer
│   ├── projectController.js
│   ├── blogController.js
│   ├── contactController.js
│   └── portfolioController.js
├── services/                    # Business logic layer
│   ├── projectService.js
│   ├── blogService.js
│   ├── contactService.js
│   └── portfolioService.js
├── models/                      # Database query layer
│   ├── projectModel.js
│   ├── blogModel.js
│   ├── experienceModel.js
│   └── contactModel.js
├── middleware/                  # Custom middleware
│   ├── errorHandler.js         # Centralized error handling
│   └── upload.js               # File upload configuration
└── db/                         # Database files
    ├── schema.sql              # Database schema
    └── seed.sql                # Sample data
```

## Prerequisites
- PostgreSQL installed and running
- Node.js installed (v18 or higher)
- Postman or curl (for manual data management)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
# or manually:
npm install pg multer express cors helmet morgan dotenv
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and update with your database credentials:
```bash
cp .env.example .env
```

Edit `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
```

### 3. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE portfolio;

# Exit psql
\q
```

### 4. Run Database Migrations
```bash
# Create schema (tables)
psql -U postgres -d portfolio -f db/schema.sql

# Seed initial data
psql -U postgres -d portfolio -f db/seed.sql
```

### 5. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Frontend Endpoints (Read-Only)
These are the only endpoints your frontend should use:

- `GET /api/health` - Health check
- `GET /api/portfolio` - Complete portfolio data (featured projects + experience + contact)
- `GET /api/projects` - All projects
- `GET /api/projects/:id` - Single project
- `GET /api/blogs` - All blogs
- `GET /api/blogs/:id` - Single blog (auto-increments views)
- `GET /api/contact/info` - Your contact information
- `POST /api/contact` - Visitor contact form submission
- `POST /api/blogs/:id/like` - Increment blog likes (visitor interaction)

### Manual Data Management Endpoints
These endpoints are for YOU to manage content via Postman/curl (NOT used by frontend):

**Projects:**
- `POST /api/projects` - Add new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

**Blogs:**
- `POST /api/blogs` - Add new blog (with optional PDF)
- `PUT /api/blogs/:id` - Update blog (with optional PDF)
- `POST /api/blogs/:id/upload-pdf` - Add/Update PDF for existing blog
- `DELETE /api/blogs/:id` - Delete blog

**Contact Info:**
- `PUT /api/contact/info` - Update your contact information
- `GET /api/contact/messages` - View messages from visitors

## Adding Content to Your Portfolio

You have 3 options to add/update content:

### Option 1: Direct SQL (Recommended for Initial Setup)
```bash
psql -U postgres -d portfolio

-- Add a new blog
INSERT INTO blogs (title, excerpt, content, author, read_time, tags, category, featured)
VALUES (
  'My New Blog Post',
  'Short description',
  'Full blog content here...',
  'Your Name',
  '5 min read',
  ARRAY['React', 'TypeScript'],
  'Web Development',
  true
);

-- Add a new project
INSERT INTO projects (title, description, technologies, github, demo, category, featured, status)
VALUES (
  'My Project',
  'Project description',
  ARRAY['React', 'Node.js'],
  'https://github.com/username/project',
  'https://demo.com',
  'Full Stack',
  true,
  'Completed'
);
```

### Option 2: API Calls via Postman/curl (For Ongoing Management)

**Add Blog with PDF:**
```bash
curl -X POST http://localhost:5000/api/blogs \
  -F "title=My Blog Title" \
  -F "excerpt=Short excerpt" \
  -F "content=Full blog content here..." \
  -F "author=Your Name" \
  -Important Notes

### Frontend Integration
Your React frontend should **ONLY** use these endpoints:
- `GET /api/portfolio`
- `GET /api/projects`
- `GET /api/blogs`
- `GET /api/blogs/:id`
- `POST /api/contact` (for visitor messages)
- `POST /api/blogs/:id/like` (for visitor likes)

All other endpoints (POST/PUT/DELETE) are for manual content management only.

### File Storage
- PDFs stored in `/uploads/blogs/` directory
- Database stores only the file path (e.g., `/uploads/blogs/my-blog-1234567890.pdf`)
- Frontend accesses PDFs via: `http://localhost:5000/uploads/blogs/filename.pdf`

### Content Management Workflow
1. Write your blog post or project details
2. Add to database via SQL or API call
3. Upload PDF (if blog) via API
4. Frontend automatically displays new content

### Database Queries
```bash
# View all data
psql -U postgres -d portfolio

# Check blogs
SELECT id, title, featured, pdf_path FROM blogs;

# Check projects
SELECT id, title, category, featured FROM projects;

# View visitor messages
SELECT * FROM contact_messages ORDER BY created_at DESC;
```
    "description": "Project description",
    "technologies": ["React", "Node.js", "PostgreSQL"],
    "github": "https://github.com/username/project",
    "demo": "https://demo.com",
    "category": "Full Stack",
    "featured": true,
    "status": "Completed"
  }'
```

**Update Your Contact Info:**
```bash
curl -X PUT http://localhost:5000/api/contact/info \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "title": "Full Stack Developer",
    "bio": "Your bio...",
    "email": "your@email.com",
    "phone": "+1234567890",
    "linkedin": "https://linkedin.com/in/yourprofile",
    "github": "https://github.com/yourusername",
    "website": "https://yourwebsite.com",
    "skills": ["React", "Node.js", "PostgreSQL", "TypeScript"]
  }'
```

### Option 3: Postman Collection
Import these endpoints into Postman for easier management with a visual interface.

**Accessing Uploaded PDFs:**
```
http://localhost:5000/uploads/blogs/filename.pdf
```
PDFs are stored in filesystem at `/uploads/blogs/`, database only stores the path.

## Architecture Layers

### Controllers (HTTP Layer)
Located in `controllers/` - Define routes and map HTTP requests to services
```javascript
// Example: projectController.js
router.get('/', projectService.getAllProjects);
router.post('/', projectService.createProject);
```

### Services (Business Logic Layer)
Located in `services/` - Handle business logic, validation, and data transformation
```javascript
// Example: projectService.js
export const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await projectModel.getAll();
  res.json({ success: true, data: projects });
});
```

### Models (Database Layer)
Located in `models/` - Execute database queries
```javascript
// Example: projectModel.js
export const projectModel = {
  getAll: async () => await query('SELECT * FROM projects')
};
```

### Middleware
- **errorHandler.js** - Centralized error handling with custom AppError class
- **upload.js** - Multer configuration for PDF file uploads

## Database Schema

### Tables
- `projects` - Portfolio projects
- `blogs` - Blog posts (with pdf_path field for PDF links)
- `experience` - Work experience
- `contact_info` - Your contact information
- `contact_messages` - Messages from visitors

### Key Features
- PostgreSQL arrays for tags and technologies
- File paths stored as strings (not binary data)
- Automatic timestamps for created_at and updated_at
- Indexes for performance optimization

## Development Tips

1. **Add New Blog with PDF:**
   - Use POST /api/blogs with multipart/form-data
   - Include 'pdf' file field
   - Database stores path like `/uploads/blogs/filename.pdf`

2. **Update Blog PDF:**
   - Use POST /api/blogs/:id/upload-pdf
   - Old PDF can be manually deleted from filesystem if needed

3. **Query Database Directly:**
   ```bash
   psql -U postgres -d portfolio
   SELECT * FROM blogs;
   ```

4. **View Logs:**
   The server logs all database queries with execution time

## Code Organization Best Practices

### Adding New Features
1. **Create Model** - Add database queries in `models/`
2. **Create Service** - Add business logic in `services/`
3. **Create Controller** - Add routes in `controllers/`
4. **Update server.js** - Import and mount the controller

### Error Handling
All errors are handled centrally via `middleware/errorHandler.js`:
```javascript
// In services, throw custom errors:
throw new AppError('Resource not found', 404);

// Or use asyncHandler wrapper:
export const getItem = asyncHandler(async (req, res) => {
  // Your code - errors automatically caught
});
```

## Troubleshooting

**Database Connection Error:**
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

**File Upload Error:**
- Check `/uploads/blogs/` directory exists and is writable
- Verify file size is under 10MB
- Ensure file is PDF format

**Port Already in Use:**
- Change PORT in `.env` file
- Or kill process: `lsof -ti:5000 | xargs kill`

**Import Errors:**
- Ensure all imports use `.js` extension (ES6 modules)
- Check file paths are correct relative to importing file
