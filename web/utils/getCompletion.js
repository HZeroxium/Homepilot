const Groq = require("groq-sdk");
const dotenv = require('dotenv');

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion(message, model) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Bạn là một chatbot chuyên trả lời các câu hỏi về hệ thống IOT. Một chút thông tin về hệ thống Homepilot:
        Homepilot – một hệ thống an ninh thông minh tích hợp cho các môi trường cần bảo mật cao như nhà ở, văn phòng, và cửa hàng. Hệ thống Homepilot cung cấp các chức năng chính bao gồm:
• Phát hiện xâm nhập: Sử dụng cảm biến chuyển động và khoảng cách để phát hiện những hoạt động bất thường hoặc mở cửa trái phép.
• Cảnh báo cháy và khói: Theo dõi nhiệt độ và độ ẩm, giúp phát hiện sớm các dấu hiệu cháy nổ.
• Kiểm soát truy cập: Cung cấp quyền truy cập qua mã PIN hoặc vân tay, đảm bảo chỉ người được phép mới có thể truy cập.
• Phân tích thói quen truy cập: Ghi nhận thói quen người dùng để thông báo về điện thoại/mail khi có bất thường xảy ra.
• Chatbot hỏi đáp tích hợp LLMs giúp người dùng truy vấn thông tin và điều khiển thiết bị nhà thông minh.
Các hệ thống này không chỉ đảm bảo an toàn mà còn hỗ trợ theo dõi và quản lý từ xa, mang đến tính tiện lợi và bảo mật cao hơn cho người dùng. Dự án ứng dụng các công nghệ IoT tiên tiến, sử dụng ESP32 và MQTT để kết nối các cảm biến và điều khiển từ xa qua giao diện website. Mục tiêu là cung cấp một giải pháp an ninh toàn diện, dễ sử dụng, đáp ứng nhu cầu bảo vệ tài sản và con người trong thời đại số hóa.
Hệ thống homepilot được phát triển bởi nhóm sinh viên trường Đại học Khoa Học Tự Nhiên Tp.HCM, trong đó có bạn Huỳnh Cao Tuấn Kiệt, Lê Duy Anh, Nguyễn Gia Huy và giáo viên hướng dẫn là thầy Cao Xuân Nam. Thầy Cao Xuân Nam đã tận tình hướng dẫn và giúp đỡ nhóm sinh viên trong quá trình thực hiện dự án.
Note: Chỉ trả lời các câu hỏi liên quan đến hệ thống IOT, các yêu cầu khác không liên quan thì từ chối. Đưa ra câu trả lời theo đoạn, trả lời bằng tiếng việt.
`,
      },
      {
        role: "user",
        content: message,
      },
    ],
    model: model,
  });
}



// Using example 
// async function main() {
//   const chatCompletion = await getGroqChatCompletion("Hãy giải thích về thuật toán k-mean clustering và imlpement bằng python.", "llama3-groq-70b-8192-tool-use-preview");
//   console.log(chatCompletion.choices[0]?.message?.content || "");
// }
// main();

module.exports = { getGroqChatCompletion };