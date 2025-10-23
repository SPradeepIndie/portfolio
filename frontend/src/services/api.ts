/**
 * Copyright (C) 2024 Your Name
 * All rights reserved.
 */

import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://your-api-domain.com' 
    : 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Type definitions
export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  github: string;
  demo: string | null;
  image: string;
  category: string;
  featured: boolean;
  createdAt: string;
  status: 'Completed' | 'In Progress' | 'Planning';
}

export interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  image: string;
  category: string;
  views: number;
  likes: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total: number;
}

export interface PortfolioData {
  name: string;
  title: string;
  description: string;
  skills: string[];
  experience: number;
  location: string;
}

// API service functions
export const apiService = {
  // Projects
  async getProjects(): Promise<Project[]> {
    try {
      const response = await api.get<ApiResponse<Project[]>>('/api/projects');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw new Error('Failed to load projects');
    }
  },

  async getProject(id: number): Promise<Project | null> {
    try {
      const projects = await this.getProjects();
      return projects.find(project => project.id === id) || null;
    } catch (error) {
      console.error(`Failed to fetch project ${id}:`, error);
      throw new Error('Failed to load project');
    }
  },

  // Blogs
  async getBlogs(): Promise<Blog[]> {
    try {
      const response = await api.get<ApiResponse<Blog[]>>('/api/blogs');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      throw new Error('Failed to load blogs');
    }
  },

  async getBlog(id: number): Promise<Blog | null> {
    try {
      const blogs = await this.getBlogs();
      return blogs.find(blog => blog.id === id) || null;
    } catch (error) {
      console.error(`Failed to fetch blog ${id}:`, error);
      throw new Error('Failed to load blog');
    }
  },

  // Portfolio data
  async getPortfolio(): Promise<PortfolioData> {
    try {
      const response = await api.get<PortfolioData>('/api/portfolio');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
      throw new Error('Failed to load portfolio data');
    }
  },

  // Contact
  async sendContact(data: { name: string; email: string; message: string }): Promise<void> {
    try {
      await api.post('/api/contact', data);
    } catch (error) {
      console.error('Failed to send contact message:', error);
      throw new Error('Failed to send message');
    }
  }
};

export default api;
