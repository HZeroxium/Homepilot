// utils/convertTimestamp.js
function convertTimestamp(timestamp) {
  // Lấy giá trị seconds từ timestamp
  const seconds = timestamp._seconds;
  const nanoseconds = timestamp._nanoseconds;

  // Tạo đối tượng Date từ seconds (nanoseconds được dùng nếu cần độ chính xác cao hơn)
  const date = new Date(seconds * 1000 + nanoseconds / 1000000);

  // Lấy các phần của thời gian
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const secondsPart = date.getSeconds().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  // Kết hợp thành chuỗi định dạng
  return `${hours}:${minutes}:${secondsPart} ${day}/${month}/${year}`;
}

export default convertTimestamp;
