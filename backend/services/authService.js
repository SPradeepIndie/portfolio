/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { userModel } from '../models/userModel.js';
import { refreshTokenModel } from '../models/refreshTokenModel.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'change-me-access-secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'change-me-refresh-secret';
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const getRefreshTokenExpirationDate = () => {
  const now = Date.now();

  if (REFRESH_TOKEN_EXPIRES_IN.endsWith('d')) {
    const days = parseInt(REFRESH_TOKEN_EXPIRES_IN, 10);
    return new Date(now + days * 24 * 60 * 60 * 1000);
  }

  if (REFRESH_TOKEN_EXPIRES_IN.endsWith('h')) {
    const hours = parseInt(REFRESH_TOKEN_EXPIRES_IN, 10);
    return new Date(now + hours * 60 * 60 * 1000);
  }

  return new Date(now + 7 * 24 * 60 * 60 * 1000);
};

const hashRefreshToken = (refreshToken) =>
  crypto.createHash('sha256').update(refreshToken).digest('hex');

const generateAccessToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );

const generateRefreshToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'refresh',
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );

const sanitizeUser = (user) => ({
  id: user.id,
  full_name: user.full_name,
  email: user.email,
  role: user.role,
  is_active: user.is_active,
  phone_number: user.phone_number,
  github_link: user.github_link,
  linkedin_address: user.linkedin_address,
  created_at: user.created_at,
  updated_at: user.updated_at,
  last_login_at: user.last_login_at,
});

const getRefreshTokenFromRequest = (req) =>
  req.body?.refreshToken || req.cookies?.refreshToken || null;

export const register = asyncHandler(async (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    throw new AppError('full_name, email and password are required', 400);
  }

  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters long', 400);
  }

  const existingUser = await userModel.getByEmail(email);
  if (existingUser) {
    throw new AppError('Email already exists', 409);
  }

  const password_hash = await bcrypt.hash(password, 12);
  const newUser = await userModel.create({ full_name, email, password_hash, role: 'user' });

  res.status(201).json({
    success: true,
    data: sanitizeUser(newUser),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const user = await userModel.getByEmail(email);
  if (!user || !user.is_active) {
    throw new AppError('Invalid credentials', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const tokenHash = hashRefreshToken(refreshToken);

  await refreshTokenModel.create({
    user_id: user.id,
    token_hash: tokenHash,
    expires_at: getRefreshTokenExpirationDate(),
  });

  await userModel.updateLastLogin(user.id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    data: {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const providedRefreshToken = getRefreshTokenFromRequest(req);

  if (!providedRefreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  let decoded;
  try {
    decoded = jwt.verify(providedRefreshToken, REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  if (decoded.type !== 'refresh') {
    throw new AppError('Invalid refresh token type', 401);
  }

  const tokenHash = hashRefreshToken(providedRefreshToken);
  const storedToken = await refreshTokenModel.getValidByTokenHash(tokenHash);

  if (!storedToken || !storedToken.is_active) {
    throw new AppError('Refresh token is revoked or expired', 401);
  }

  await refreshTokenModel.revokeByTokenHash(tokenHash);

  const nextUser = {
    id: storedToken.user_id_ref,
    email: storedToken.email,
    role: storedToken.role,
  };

  const newAccessToken = generateAccessToken(nextUser);
  const newRefreshToken = generateRefreshToken(nextUser);
  const newTokenHash = hashRefreshToken(newRefreshToken);

  await refreshTokenModel.create({
    user_id: storedToken.user_id_ref,
    token_hash: newTokenHash,
    expires_at: getRefreshTokenExpirationDate(),
  });

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      tokenType: 'Bearer',
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const providedRefreshToken = getRefreshTokenFromRequest(req);

  if (providedRefreshToken) {
    const tokenHash = hashRefreshToken(providedRefreshToken);
    await refreshTokenModel.revokeByTokenHash(tokenHash);
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await userModel.getById(req.user.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: user,
  });
});

export const updateMe = asyncHandler(async (req, res) => {
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

  if (typeof req.body.phone_number !== 'undefined') {
    updateData.phone_number = req.body.phone_number;
  }
  if (typeof req.body.github_link !== 'undefined') {
    updateData.github_link = req.body.github_link;
  }
  if (typeof req.body.linkedin_address !== 'undefined') {
    updateData.linkedin_address = req.body.linkedin_address;
  }

  const updatedUser = await userModel.updateById(req.user.id, updateData);

  if (!updatedUser) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: updatedUser,
  });
});
