/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { contactModel } from '../models/contactModel.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

/**
 * @desc    Get contact info
 * @route   GET /api/contact/info
 * @access  Public
 */
export const getContactInfo = asyncHandler(async (req, res) => {
  const info = await contactModel.getInfo();
  
  res.json({
    success: true,
    data: info
  });
});

/**
 * @desc    Update contact info
 * @route   PUT /api/contact/info
 * @access  Private (manual via Postman)
 */
export const updateContactInfo = asyncHandler(async (req, res) => {
  const info = await contactModel.updateInfo(req.body);
  
  res.json({
    success: true,
    data: info
  });
});

/**
 * @desc    Submit contact form
 * @route   POST /api/contact
 * @access  Public
 */
export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    throw new AppError('Name, email, and message are required', 400);
  }
  
  await contactModel.saveMessage({ name, email, message });
  
  res.json({
    success: true,
    message: 'Thank you for your message! I\'ll get back to you soon.'
  });
});

/**
 * @desc    Get all contact messages
 * @route   GET /api/contact/messages
 * @access  Private (manual via Postman)
 */
export const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await contactModel.getAllMessages();
  
  res.json({
    success: true,
    data: messages,
    total: messages.length
  });
});

/**
 * @desc    Get single contact message
 * @route   GET /api/contact/messages/:id
 * @access  Private (manual via Postman)
 */
export const getMessageById = asyncHandler(async (req, res) => {
  const message = await contactModel.getMessageById(req.params.id);
  
  if (!message) {
    throw new AppError('Message not found', 404);
  }
  
  res.json({
    success: true,
    data: message
  });
});

/**
 * @desc    Delete contact message
 * @route   DELETE /api/contact/messages/:id
 * @access  Private (manual via Postman)
 */
export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await contactModel.deleteMessage(req.params.id);
  
  if (!message) {
    throw new AppError('Message not found', 404);
  }
  
  res.json({
    success: true,
    message: 'Message deleted successfully'
  });
});
