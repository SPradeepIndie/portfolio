/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

/**
 * Centralized error handling middleware
 */

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error wrapper to avoid try-catch in every controller
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Database error handler
const handleDatabaseError = (error) => {
  if (error.code === '23505') {
    return new AppError('Duplicate entry found', 409);
  }
  if (error.code === '23503') {
    return new AppError('Referenced record not found', 404);
  }
  if (error.code === '22P02') {
    return new AppError('Invalid input format', 400);
  }
  return new AppError('Database operation failed', 500);
};

// Not found handler
export const notFound = (req, res, next) => {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
  });

  // Handle database errors
  if (err.code) {
    error = handleDatabaseError(err);
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
