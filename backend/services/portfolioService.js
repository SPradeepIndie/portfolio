/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { contactModel } from '../models/contactModel.js';
import { projectModel } from '../models/projectModel.js';
import { experienceModel } from '../models/experienceModel.js';
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
  
  res.json({
    name: contactInfo?.name || 'Your Name',
    title: contactInfo?.title || 'Full Stack Developer',
    bio: contactInfo?.bio || 'Passionate developer',
    skills: contactInfo?.skills || [],
    projects: projects.slice(0, 2), // Top 2 featured projects
    contact: {
      email: contactInfo?.email,
      phone: contactInfo?.phone,
      linkedin: contactInfo?.linkedin,
      github: contactInfo?.github,
      website: contactInfo?.website
    },
    experience: experience
  });
});
