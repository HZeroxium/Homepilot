require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const http = require("http");
const appConfig = require("./config/appConfig");
const routes = require("./routes/index");
const mqttController = require("./controllers/mqttController");
const sharedsession = require("express-socket.io-session");

const app = express();
const server = http.createServer(app);

// Cấu hình session middleware
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});

app.use(sessionMiddleware);

// Khởi tạo io với cấu hình CORS
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Hoặc cấu hình domain cụ thể
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

// Sử dụng sharedsession cho Socket.io
io.use(
  sharedsession(sessionMiddleware, {
    autoSave: true,
  })
);

// Middleware để truyền io đến các middleware khác nếu cần
app.use((req, res, next) => {
  req.io = io;
  next();
});

const expressLayouts = require("express-ejs-layouts");

app.use(expressLayouts);
app.set("layout", "layouts/layout");

// Thiết lập view engine là EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware để phân tích body của request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình static files
app.use(express.static(path.join(__dirname, "public")));

// Cấu hình flash messages
app.use(flash());

// Middleware tùy chỉnh để truyền flash messages và user đến tất cả views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.user = req.session.user || null;
  next();
});

// Định nghĩa các routes
app.use("/", routes);

// Middleware xử lý lỗi
const { errorHandler } = require("./middlewares/errorMiddleware");
app.use(errorHandler);

// Đăng ký mqttController với io
mqttController(io); // Truyền io vào mqttController để xử lý Socket.io

// Lắng nghe sự kiện kết nối của Socket.io
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  // Lấy session từ socket.handshake
  const session = socket.handshake.session;
  if (session && session.user) {
    const userId = session.user.id;
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room ${userId}`);
  } else {
    console.warn(`Socket ${socket.id} has no associated user.`);
  }

  // Lắng nghe sự kiện joinRoom từ client (nếu cần)
  socket.on("joinRoom", (data) => {
    const userId = data.userId;
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room ${userId} on joinRoom event`);
  });
});

// Khởi động server
const PORT = appConfig.port;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, io };
