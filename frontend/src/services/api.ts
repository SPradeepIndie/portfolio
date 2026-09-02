/**
 * Copyright (C) 2024 Your Name
 * All rights reserved.
 */

import axios from 'axios';
import { clearAuthTokens, getAccessToken, getRefreshToken, saveAuthTokens } from './authStorage';

const apiBaseURL = import.meta.env.PROD
  ? ''
  : 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { error?: string; message?: string; detail?: string }
      | undefined;

    return responseData?.error || responseData?.message || responseData?.detail || error.message || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  return fallbackMessage;
};

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
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
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken || originalRequest.url?.includes('/api/auth/refresh')) {
        clearAuthTokens();
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await refreshClient.post('/api/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: nextRefreshToken } = refreshResponse.data.data;
        saveAuthTokens({ accessToken, refreshToken: nextRefreshToken });
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError: unknown) {
        const refreshErrorMessage = refreshError instanceof Error ? refreshError.message : 'Refresh failed';
        const refreshErrorData = typeof refreshError === 'object' && refreshError && 'response' in refreshError
          ? (refreshError as { response?: { data?: unknown } }).response?.data
          : undefined;
        clearAuthTokens();
        console.error('API Error:', refreshErrorData || refreshErrorMessage);
        return Promise.reject(refreshError);
      }
    }

    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Type definitions
export interface TimelineEvent {
  startTime: string;
  endTime: string;
  duration: string;
  description: string;
}

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
  status: 'Completed' | 'In Progress' | 'Planning' | 'Initiated';
  timeline?: TimelineEvent[];
  is_hidden?: boolean;
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
  pdf_path?: string;
  pdf_url?: string;
  is_hidden?: boolean;
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
  contact?: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  phone_number?: string;
  github_link?: string;
  linkedin_address?: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  full_name?: string;
  email?: string;
  password?: string;
  phone_number?: string;
  github_link?: string;
  linkedin_address?: string;
}

// API service functions

// Helper to calculate SHA-256 hash of a file
export async function calculateFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export const apiService = {
  // Projects
  async getProjects(): Promise<Project[]> {
    try {
      const response = await api.get<ApiResponse<Project[]>>('/api/projects');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw new Error(getErrorMessage(error, 'Failed to load projects'));
    }
  },

  async getProject(id: number): Promise<Project | null> {
    try {
      const projects = await this.getProjects();
      return projects.find(project => project.id === id) || null;
    } catch (error) {
      console.error(`Failed to fetch project ${id}:`, error);
      throw new Error(getErrorMessage(error, 'Failed to load project'));
    }
  },

  async createProject(payload: Partial<Project>): Promise<Project> {
    try {
      const response = await api.post<{ success: boolean; data: Project }>('/api/projects', payload);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to create project'));
    }
  },

  async updateProject(id: number, payload: Partial<Project>): Promise<Project> {
    try {
      const response = await api.put<{ success: boolean; data: Project }>(`/api/projects/${id}`, payload);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update project'));
    }
  },

  async deleteProject(id: number): Promise<void> {
    try {
      await api.delete(`/api/projects/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to delete project'));
    }
  },

  // Blogs
  async getBlogs(): Promise<Blog[]> {
    try {
      const response = await api.get<ApiResponse<Blog[]>>('/api/blogs');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      throw new Error(getErrorMessage(error, 'Failed to load blogs'));
    }
  },

  async getBlog(id: number): Promise<Blog | null> {
    try {
      const blogs = await this.getBlogs();
      return blogs.find(blog => blog.id === id) || null;
    } catch (error) {
      console.error(`Failed to fetch blog ${id}:`, error);
      throw new Error(getErrorMessage(error, 'Failed to load blog'));
    }
  },

  // Portfolio data
  async getPortfolio(): Promise<PortfolioData> {
    try {
      const response = await api.get<PortfolioData>('/api/portfolio');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
      throw new Error(getErrorMessage(error, 'Failed to load portfolio data'));
    }
  },

  // Contact
  async sendContact(data: { name: string; email: string; message: string }): Promise<void> {
    try {
      await api.post('/api/contact', data);
    } catch (error) {
      console.error('Failed to send contact message:', error);
      throw new Error(getErrorMessage(error, 'Failed to send message'));
    }
  },

  async login(payload: LoginPayload): Promise<AuthSession> {
    try {
      const response = await api.post<{ success: boolean; data: AuthSession }>('/api/auth/login', payload);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Login failed'));
    }
  },

  async register(payload: RegisterPayload): Promise<void> {
    try {
      await api.post('/api/auth/register', payload);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Registration failed'));
    }
  },

  async refreshTokens(refreshToken?: string): Promise<AuthSession> {
    try {
      const response = await refreshClient.post<{ success: boolean; data: AuthSession }>('/api/auth/refresh', {
        refreshToken,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Session refresh failed'));
    }
  },

  async logout(refreshToken?: string): Promise<void> {
    try {
      await api.post('/api/auth/logout', { refreshToken });
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Logout failed'));
    }
  },

  async getCurrentUser(): Promise<AuthUser> {
    try {
      const response = await api.get<{ success: boolean; data: AuthUser }>('/api/auth/me');
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to load current user'));
    }
  },

  async updateCurrentUser(payload: UpdateProfilePayload): Promise<AuthUser> {
    try {
      const response = await api.put<{ success: boolean; data: AuthUser }>('/api/auth/me', payload);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update profile'));
    }
  },

  // Blog management
  async createBlog(payload: { title: string; excerpt: string; content: string; author: string; category: string; tags: string[]; featured?: boolean; pdf_url?: string }): Promise<Blog> {
    try {
      const response = await api.post<{ success: boolean; data: Blog }>('/api/blogs', payload);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to create blog'));
    }
  },

  async updateBlog(id: number, payload: { title: string; excerpt: string; content: string; author: string; category: string; tags: string[]; featured?: boolean; pdf_url?: string }): Promise<Blog> {
    try {
      const response = await api.put<{ success: boolean; data: Blog }>(`/api/blogs/${id}`, payload);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update blog'));
    }
  },

  async deleteBlog(id: number): Promise<void> {
    try {
      await api.delete(`/api/blogs/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to delete blog'));
    }
  },

  // Azure Blob Storage PDF upload flow
  async requestPdfUploadUrl(filename: string, fileHash?: string): Promise<{ uploadUrl: string; blobName: string; expiresIn: number; exists?: boolean }> {
    try {
      const response = await api.post<{ success: boolean; data: { uploadUrl: string; blobName: string; expiresIn: number; exists?: boolean } }>('/api/admin/pdfs/upload-url/request', { filename, fileHash });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to request upload URL'));
    }
  },

  async uploadPdfToBlob(uploadUrl: string, file: File): Promise<void> {
    try {
      // Upload directly to Azure Blob Storage using the SAS URL
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to upload PDF to storage'));
    }
  },

  async savePdfReference(blogId: number, pdf_url: string): Promise<Blog> {
    try {
      const response = await api.post<{ success: boolean; data: Blog }>(`/api/blogs/${blogId}/upload-pdf`, { pdf_url });
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to save PDF reference'));
    }
  },

  async getUploadedPdfs(): Promise<Array<{ id: number; filename: string; file_path: string; file_size: number; uploaded_at: string }>> {
    try {
      const response = await api.get<{ success: boolean; data: Array<{ id: number; filename: string; file_path: string; file_size: number; uploaded_at: string }> }>('/api/admin/pdfs');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch PDFs:', error);
      throw new Error(getErrorMessage(error, 'Failed to load PDFs'));
    }
  },

  async uploadPdf(file: File): Promise<{ id: number; filename: string; file_path: string; file_size: number; uploaded_at: string }> {
    try {
      const { uploadUrl } = await this.requestPdfUploadUrl(file.name);

      await this.uploadPdfToBlob(uploadUrl, file);

      const directUrl = uploadUrl.split('?')[0];

      const response = await api.post<{ success: boolean; data: { id: number; filename: string; file_path: string; file_size: number; uploaded_at: string } }>('/api/admin/pdfs/upload', {
        title: file.name,
        original_name: file.name,
        file_path: directUrl,
        file_size: file.size,
        file_hash: await calculateFileHash(file),
      });

      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to upload PDF'));
    }
  },

  async deletePdf(id: number): Promise<void> {
    try {
      await api.delete(`/api/admin/pdfs/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to delete PDF'));
    }
  },

  // Settings
  async getSettings() {
    const response = await api.get('/api/settings');
    return response.data.data;
  },
  async createCategory(payload: { name: string, entity_type: string }) {
    const response = await api.post('/api/settings/categories', payload);
    return response.data.data;
  },
  async deleteCategory(id: number) {
    await api.delete(`/api/settings/categories/${id}`);
  },
  async createTag(payload: { name: string, entity_type: string }) {
    const response = await api.post('/api/settings/tags', payload);
    return response.data.data;
  },
  async deleteTag(id: number) {
    await api.delete(`/api/settings/tags/${id}`);
  }
};

export default api;
