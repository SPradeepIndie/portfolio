CREATE TABLE IF NOT EXISTS research (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    abstract TEXT NOT NULL,
    content TEXT,
    author VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Ongoing',
    category VARCHAR(100) DEFAULT 'Computer Science',
    tags TEXT[] NOT NULL DEFAULT '{}',
    pdf_url VARCHAR(500),
    featured BOOLEAN DEFAULT false,
    is_hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
