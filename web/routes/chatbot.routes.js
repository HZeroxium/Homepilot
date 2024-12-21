// routes/chatbot.route.js

import express from 'express';
import chatbotController from '../controllers/chatbot.controller.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(ensureAuthenticated);

router.get('/', chatbotController.getChatbotPage);

export default router;
