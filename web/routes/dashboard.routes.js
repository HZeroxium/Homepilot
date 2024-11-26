// routes/dashboard.route.js

import express from 'express';
import dashboardController from '../controllers/dashboard.controller.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply ensureAuthenticated middleware to all routes
router.use(ensureAuthenticated);

// Display dashboard page
router.get('/', dashboardController.getDashboard);

export default router;
