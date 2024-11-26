// controllers/socketController.js
import { getGroqChatCompletion } from "../utils/getCompletion.js";
import tools from "../utils/tools.js";
import getTemperatureAndHumidityAndLight from "../utils/getSensorData.js";
import convertTimestamp from "../utils/convertTimestamp.js";

const socketController = (socket) => {
    console.log("A client connected:", socket.id);

    // Retrieve session from socket handshake
    const session = socket.handshake.session;
    if (session && session.user) {
        const userId = session.user.id;
        socket.join(userId);
        console.log(`Socket ${socket.id} joined room ${userId}`);
    } else {
        console.warn(`Socket ${socket.id} has no associated user.`);
    }

    // Listen for joinRoom event from client (if needed)
    socket.on("joinRoom", (data) => {
        const userId = data.userId;
        socket.join(userId);
        console.log(`Socket ${socket.id} joined room ${userId} on joinRoom event`);
    });

    // Listen for chat messages from the frontend
    socket.on("chatMessage", async (data) => {
        try {
            const { message, userID } = data;
            let chatCompletion = await getGroqChatCompletion(message, "llama3-groq-70b-8192-tool-use-preview", tools, null);
            const botResponse = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't understand your message.";
            const tool_call = chatCompletion.choices[0]?.finish_reason;

            if (tool_call && tool_call == "tool_calls") {
                const fire_smoke_data = await getTemperatureAndHumidityAndLight(userID);
                for (let i = 0; i < fire_smoke_data.length; i++) {
                    fire_smoke_data[i].timestamp = convertTimestamp(fire_smoke_data[i].timestamp);
                }
                const additional_conversation = {
                    role: "system",
                    content: `Nhiệt độ, độ ẩm, độ sáng... đã đo được từ hệ thống là: ${JSON.stringify(fire_smoke_data)}`,
                };

                const chatCompletion = await getGroqChatCompletion(message, "llama3-groq-70b-8192-tool-use-preview", null, additional_conversation);
                const botResponse = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't understand your message.";
                socket.emit("botResponse", botResponse);
            } else {
                socket.emit("botResponse", botResponse);
            }
        } catch (error) {
            console.error("Error in chat: ", error);
            socket.emit("botResponse", "Sorry, there was an error processing your message.");
        }
    });
};

export default socketController;