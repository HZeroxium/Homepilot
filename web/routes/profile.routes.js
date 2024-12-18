// routes/profile.route.js

import express from 'express';
import profileController from '../controllers/profile.controller.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(ensureAuthenticated);

router.get('/', profileController.getProfilePage);
router.post('/update_profile', profileController.updateProfile);

export default router;