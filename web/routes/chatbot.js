// routes/chatbot.js
import express from "express";
const router = express.Router();
import chatbotController from "../controllers/chatbotController.js";
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";

router.use(ensureAuthenticated);

router.get("/", chatbotController.getChatbotPage);
router.post("/message", chatbotController.sendMessage);

export default router;
