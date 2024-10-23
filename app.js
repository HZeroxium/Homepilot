// app.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const appConfig = require("./config/appConfig");
const routes = require("./routes/index");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

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

// Cấu hình session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

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
app.use(errorHandler);

// Khởi động server
const PORT = appConfig.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
