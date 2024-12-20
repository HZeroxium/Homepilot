// routes/index.route.js

import express from 'express';
import authRoutes from './auth.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import devicesRoutes from './devices.routes.js';
import chatbotRoutes from './chatbot.routes.js';
import profileRoutes from './profile.routes.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Other routes
router.use('/', authRoutes);
router.use('/dashboard', ensureAuthenticated, dashboardRoutes);
router.use('/devices', ensureAuthenticated, devicesRoutes);
router.use('/chatbot', ensureAuthenticated, chatbotRoutes);
router.use('/profile', ensureAuthenticated, profileRoutes);

// Handle non-existent routes
router.use((req, res) => {
  res.status(404).render('errors/404', {
    title: '404 - Page Not Found',
    message: 'The page you are looking for does not exist.',
  });
});

export default router;
