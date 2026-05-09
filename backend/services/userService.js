/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import bcrypt from 'bcryptjs';
import { userModel } from '../models/userModel.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const allowedRoles = new Set(['user', 'admin']);

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userModel.getAll();

  res.json({
    success: true,
    data: users,
    total: users.length,
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const targetId = Number(req.params.id);
  const requesterId = Number(req.user.id);

  if (req.user.role !== 'admin' && requesterId !== targetId) {
    throw new AppError('Forbidden: you can only access your own account', 403);
  }

  const user = await userModel.getById(targetId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: user,
  });
});

export const createUser = asyncHandler(async (req, res) => {
  const { full_name, email, password, role = 'user' } = req.body;

  if (!full_name || !email || !password) {
    throw new AppError('full_name, email and password are required', 400);
  }

  if (!allowedRoles.has(role)) {
    throw new AppError('Role must be either user or admin', 400);
  }

  const existingUser = await userModel.getByEmail(email);
  if (existingUser) {
    throw new AppError('Email already exists', 409);
  }

  const password_hash = await bcrypt.hash(password, 12);
  const user = await userModel.create({ full_name, email, password_hash, role });

  res.status(201).json({
    success: true,
    data: user,
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const targetId = Number(req.params.id);
  const requesterId = Number(req.user.id);

  if (req.user.role !== 'admin' && requesterId !== targetId) {
    throw new AppError('Forbidden: you can only update your own account', 403);
  }

  const existing = await userModel.getById(targetId);
  if (!existing) {
    throw new AppError('User not found', 404);
  }

  const updateData = {};

  if (typeof req.body.full_name !== 'undefined') {
    updateData.full_name = req.body.full_name;
  }

  if (typeof req.body.email !== 'undefined') {
    updateData.email = req.body.email;
  }

  if (typeof req.body.password !== 'undefined') {
    if (req.body.password.length < 8) {
      throw new AppError('Password must be at least 8 characters long', 400);
    }
    updateData.password_hash = await bcrypt.hash(req.body.password, 12);
  }

  if (typeof req.body.role !== 'undefined') {
    if (req.user.role !== 'admin') {
      throw new AppError('Only admin can change user role', 403);
    }
    if (!allowedRoles.has(req.body.role)) {
      throw new AppError('Role must be either user or admin', 400);
    }
    updateData.role = req.body.role;
  }

  if (typeof req.body.is_active !== 'undefined') {
    if (req.user.role !== 'admin') {
      throw new AppError('Only admin can change active status', 403);
    }
    updateData.is_active = req.body.is_active;
  }

  const updated = await userModel.updateById(targetId, updateData);

  res.json({
    success: true,
    data: updated,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const targetId = Number(req.params.id);

  const user = await userModel.deactivateById(targetId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    message: 'User deactivated successfully',
  });
});
