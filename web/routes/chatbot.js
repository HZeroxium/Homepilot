// routes/chatbot.js

import express from "express";
import chatbotController from "../controllers/chatbotController.js";
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(ensureAuthenticated);

router.get("/", chatbotController.getChatbotPage);
router.post("/message", chatbotController.sendMessage);

export default router;
