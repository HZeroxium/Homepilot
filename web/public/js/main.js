// public/js/main.js

const socket = io();

// Lắng nghe sự kiện 'deviceStatusUpdate' từ server
socket.on("deviceStatusUpdate", (data) => {
  console.log("Received device status update:", data);

  // Cập nhật giao diện dựa trên dữ liệu nhận được
  // Ví dụ:
  const deviceElement = document.getElementById(`device-${data.deviceId}`);
  if (deviceElement) {
    deviceElement.querySelector(".device-status").textContent =
      `Trạng thái: ${data.status}`;
    // Cập nhật các thông tin khác nếu cần
  }
});
