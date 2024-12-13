// services/socketService.js

import ChatbotService from './chatbot.service.js';
import DeviceService from './device.service.js';
import { convertTimestamp } from '../utils/convertTimeStamp.js';

class SocketService {
  static async processChatMessage({ message, userId }) {
    const tools = null; // Specify tools if required
    const chatCompletion = await ChatbotService.getCompletion(
      message,
      'llama3-groq-70b-8192-tool-use-preview',
      tools
    );

    const botResponse =
      chatCompletion.choices[0]?.message?.content ||
      "Sorry, I couldn't understand your message.";
    const toolCall = chatCompletion.choices[0]?.finish_reason;

    if (toolCall === 'tool_calls') {
      const fireSmokeData = await DeviceService.getSensorData(userId);
      fireSmokeData.forEach((data) => {
        data.timestamp = convertTimestamp(data.timestamp);
      });

      const additionalConversation = {
        role: 'system',
        content: `Nhiệt độ, độ ẩm, độ sáng... từ hệ thống: ${JSON.stringify(fireSmokeData)}`,
      };

      const followUp = await ChatbotService.getCompletion(
        message,
        'llama3-groq-70b-8192-tool-use-preview',
        null,
        additionalConversation
      );

      return followUp.choices[0]?.message?.content || botResponse;
    }

    return botResponse;
  }
}

export default SocketService;
