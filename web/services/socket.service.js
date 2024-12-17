// services/socketService.js

import ChatbotService from './chatbot.service.js';
import DeviceService from './device.service.js';
import { convertTimestamp } from '../utils/convertTimeStamp.js';
import {tools} from '../utils/constants.js'
class SocketService {
  static async processChatMessage({ message, userId }) {
    const chatCompletion = await ChatbotService.getCompletion(
      message,
      'llama3-groq-70b-8192-tool-use-preview',
      tools,
      null  
    );

    const botResponse =
      chatCompletion.choices[0]?.message?.content ||
      "Sorry, I couldn't understand your message.";
    const toolCall = chatCompletion.choices[0]?.finish_reason;
    if (toolCall === 'tool_calls') {
      const sensorData = await DeviceService.getSensorData(userId);
      if (!sensorData || sensorData.length === 0) {
        return 'No sensor data available for this user.';
      }


      const sensorSummary = sensorData.map((data) => {
        if (data.type === 'fire_smoke') {
          return `Device: ${data.name}, Temperature: ${data.temperature}°C, Humidity: ${data.humidity}%, Light: ${data.light} lux`;
        } else if (data.type === 'intrusion') {
          return `Device: ${data.name}, Distance: ${data.distance} cm, Motion: ${data.motion ? 'Detected' : 'Not Detected'}`;
        } else {
          return `Device: ${data.name}, Type: ${data.type}`;
        }
      });

      const additionalConversation = {
        role: 'system',
        content: `Sensor data from the system:\n${sensorSummary.join('\n')}`,
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
