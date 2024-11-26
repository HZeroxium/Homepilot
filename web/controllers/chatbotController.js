// controllers/chatbotController.js
import { getGroqChatCompletion } from "../utils/getCompletion.js";

const chatbotController = {
    async getChatbotPage(req, res) {
        res.render("chatbot", { messages: [], userID: req.session.user.uid });
    },

    async sendMessage(req, res) {
        const userMessage = req.body.message;

        try {
            // Call the LLM API with the user's message
            const chatCompletion = await getGroqChatCompletion(userMessage, "llama3-groq-70b-8192-tool-use-preview");

            // Get the response from the model
            const responseMessage = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't process your message.";

            // Send back the user message and the model's response
            res.json({
                userMessage: userMessage,
                botMessage: responseMessage
            });
        } catch (error) {
            res.status(500).json({ error: "An error occurred while processing your message." });
        }
    }
};
export default chatbotController;