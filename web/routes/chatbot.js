// routes/chatbot.js
const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");

router.get("/", chatbotController.getChatbotPage);
router.post("/message", chatbotController.sendMessage);

module.exports = router;
