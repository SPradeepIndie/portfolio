/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import jwt from 'jsonwebtoken';
import { asyncHandler, AppError } from './errorHandler.js';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'change-me-access-secret';

export const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    throw new AppError('Access token is required', 401);
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    throw new AppError('Invalid or expired access token', 401);
  }
});

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Unauthorized', 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(new AppError('Forbidden: insufficient permissions', 403));
  }

  return next();
};
