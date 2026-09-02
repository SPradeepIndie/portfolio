/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { contactModel } from '../models/contactModel.js';
import { projectModel } from '../models/projectModel.js';
import { experienceModel } from '../models/experienceModel.js';
import { userModel } from '../models/userModel.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Get complete portfolio data
 * @route   GET /api/portfolio
 * @access  Public
 */
export const getPortfolio = asyncHandler(async (req, res) => {
  const contactInfo = await contactModel.getInfo();
  const projects = await projectModel.getFeatured();
  const experience = await experienceModel.getAll();
  const users = await userModel.getAll();
  const adminUser = users.find(u => u.role === 'admin') || users[0];
  
  res.json({
    name: adminUser?.full_name || contactInfo?.name || 'Your Name',
    title: contactInfo?.title || 'Full Stack Developer',
    bio: contactInfo?.bio || 'Passionate developer',
    skills: contactInfo?.skills || [],
    projects: projects.slice(0, 2), // Top 2 featured projects
    contact: {
      email: adminUser?.email || contactInfo?.email,
      phone: adminUser?.phone_number || contactInfo?.phone,
      linkedin: adminUser?.linkedin_address || contactInfo?.linkedin,
      github: adminUser?.github_link || contactInfo?.github,
      website: contactInfo?.website
    },
    experience: experience
  });
});
