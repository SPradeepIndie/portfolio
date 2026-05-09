/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Portfolio Backend API',
    version: '1.1.0',
    description: 'API documentation for portfolio backend with JWT auth, user management, and PDF uploads.',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local development server',
    },
  ],
  tags: [
    { name: 'Health' },
    { name: 'Auth' },
    { name: 'Account' },
    { name: 'Users' },
    { name: 'PDFs' },
    { name: 'Admin Users' },
    { name: 'Admin PDFs' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Invalid credentials' },
        },
      },
      AuthTokens: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          tokenType: { type: 'string', example: 'Bearer' },
          expiresIn: { type: 'string', example: '15m' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          full_name: { type: 'string', example: 'Admin User' },
          email: { type: 'string', format: 'email', example: 'admin@example.com' },
          role: { type: 'string', example: 'admin' },
          is_active: { type: 'boolean', example: true },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
          last_login_at: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      PdfUpload: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Project Specification' },
          original_name: { type: 'string', example: 'spec.pdf' },
          file_path: { type: 'string', example: '/uploads/pdfs/spec-123.pdf' },
          uploaded_by: { type: 'integer', example: 1 },
          created_at: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Check API health',
        responses: {
          200: {
            description: 'API is running',
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Create new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['full_name', 'email', 'password'],
                properties: {
                  full_name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Account created',
          },
          409: {
            description: 'Email already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and get access/refresh tokens',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
          },
          401: {
            description: 'Invalid credentials',
          },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh JWT access token',
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Token refreshed',
          },
          401: {
            description: 'Invalid refresh token',
          },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout user and revoke refresh token',
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Logged out',
          },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current logged-in user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Current user details',
          },
          401: {
            description: 'Unauthorized',
          },
        },
      },
      put: {
        tags: ['Account'],
        summary: 'Update current logged-in user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  full_name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'User profile updated',
          },
          401: {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/api/admin/users': {
      get: {
        tags: ['Admin Users'],
        summary: 'Get all users (admin only)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User list',
          },
          403: {
            description: 'Forbidden',
          },
        },
      },
      post: {
        tags: ['Admin Users'],
        summary: 'Create user (admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['full_name', 'email', 'password'],
                properties: {
                  full_name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  role: { type: 'string', enum: ['user', 'admin'] },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User created',
          },
        },
      },
    },
    '/api/admin/users/{id}': {
      get: {
        tags: ['Admin Users'],
        summary: 'Get single user (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'User details',
          },
          403: {
            description: 'Forbidden',
          },
        },
      },
      put: {
        tags: ['Admin Users'],
        summary: 'Update user account (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  full_name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  role: { type: 'string', enum: ['user', 'admin'] },
                  is_active: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'User updated',
          },
        },
      },
      delete: {
        tags: ['Admin Users'],
        summary: 'Deactivate user (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'User deactivated',
          },
        },
      },
    },
    '/api/admin/pdfs': {
      get: {
        tags: ['Admin PDFs'],
        summary: 'Get uploaded PDFs',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Uploaded PDF records',
          },
        },
      },
    },
    '/api/admin/pdfs/upload': {
      post: {
        tags: ['Admin PDFs'],
        summary: 'Upload PDF file',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['pdf'],
                properties: {
                  title: { type: 'string' },
                  pdf: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'PDF uploaded',
          },
          400: {
            description: 'Invalid upload payload',
          },
        },
      },
    },
    '/api/admin/pdfs/{id}': {
      delete: {
        tags: ['Admin PDFs'],
        summary: 'Delete uploaded PDF record and file',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'PDF deleted',
          },
          404: {
            description: 'PDF not found',
          },
        },
      },
    },
  },
};

export default swaggerDocument;
