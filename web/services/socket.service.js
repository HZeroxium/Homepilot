// services/socketService.js

import ChatbotService from './chatbot.service.js';
import DeviceService from './device.service.js';
import { convertTimestamp } from '../utils/convertTimeStamp.js';
import {tools} from '../utils/constants.js'

class SocketService {
  static async processChatMessage({ message, userId }) {
    const chatCompletion = await ChatbotService.getCompletion(
      message,
      'gpt-4o-mini',
      tools,
      null  
    );

    const botResponse =
      chatCompletion.choices[0]?.message?.content ||
      "Xin lỗi, tôi không hiểu câu trả lời của bạn. Bạn có thể nói rõ hơn không?";
    const toolCall = chatCompletion.choices[0]?.finish_reason;
    if (toolCall === 'tool_calls') {
      const sensorData = await DeviceService.getSensorData(userId);
      if (!sensorData || sensorData.length === 0) {
        return 'Không có dữ liệu của người dùng này.';
      }

      
      const sensorSummary = sensorData.map((data) => {
        if (data.type === 'fire_smoke') {
          return `Tên thiết bị: ${data.name}, Nhiệt độ: ${data.temperature}°C, Độ ẩm: ${data.humidity}%, Mức ánh sáng: ${data.light} lux`;
        } else if (data.type === 'intrusion') {
          return `Tên thiết bị: ${data.name}, Khoảng cách: ${data.distance} cm, Motion: ${data.motion ? 'Detected' : 'Not Detected'}`;
        } else if (data.type === 'access_control') {
          return `Tên thiết bị: ${data.name}, Status: ${data.status}`;
        } else {
          return `Tên thiết bị: ${data.name}, Type: ${data.type}`;
        }
      });

      const additionalConversation = {
        role: 'system',
        content: `Cảm biến ghi nhận từ hệ thống: ${sensorSummary.join('\n')} Note: hãy trả lời bằng tiếng việt(Vietnamese).`,
      };

      const followUp = await ChatbotService.getCompletion(
        message,
        'gpt-4o-mini',
        null,
        additionalConversation
      );
      console.log(`Bot respond: ${followUp.choices[0]?.message?.content} ${convertTimestamp(new Date())}`);

      return followUp.choices[0]?.message?.content || botResponse;
    }

    return botResponse;
  }
}

export default SocketService;
