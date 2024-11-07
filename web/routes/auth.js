// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  forwardAuthenticated,
  ensureAuthenticated,
} = require("../middlewares/authMiddleware");

// Hiển thị trang thông tin người dùng
router.post(
  "/save-fcm-token",
  ensureAuthenticated,
  authController.saveFcmToken
);

// Hiển thị trang đăng ký
router.get("/register", forwardAuthenticated, authController.getRegister);

// Xử lý đăng ký người dùng
router.post("/register", forwardAuthenticated, authController.postRegister);

// Hiển thị trang đăng nhập
router.get("/login", forwardAuthenticated, authController.getLogin);

// Xử lý đăng nhập người dùng
router.post("/login", forwardAuthenticated, authController.postLogin);

// Xử lý đăng xuất
router.get("/logout", authController.logout);

// Xử lí trang đầu
router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
