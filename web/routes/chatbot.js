// routes/chatbot.js
const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");
const { ensureAuthenticated } = require("../middlewares/authMiddleware");

router.use(ensureAuthenticated);

router.get("/", chatbotController.getChatbotPage);
router.post("/message", chatbotController.sendMessage);

module.exports = router;
