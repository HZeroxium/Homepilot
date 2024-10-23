// controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const authController = {
  // Hiển thị trang đăng ký
  getRegister: (req, res) => {
    res.render("register", { error_msg: req.flash("error_msg") });
  },

  // Xử lý đăng ký người dùng
  postRegister: async (req, res) => {
    const { displayName, email, password, confirmPassword } = req.body;

    try {
      // Kiểm tra các trường bắt buộc
      if (!displayName || !email || !password || !confirmPassword) {
        req.flash("error_msg", "Vui lòng điền vào tất cả các trường.");
        return res.redirect("/register");
      }

      // Kiểm tra mật khẩu
      if (password !== confirmPassword) {
        req.flash("error_msg", "Mật khẩu không khớp.");
        return res.redirect("/register");
      }

      // Kiểm tra email đã tồn tại
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        req.flash("error_msg", "Email đã được sử dụng.");
        return res.redirect("/register");
      }

      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Tạo UID cho người dùng
      const uid = require("uuid").v4();

      // Tạo người dùng mới
      const newUser = new User(uid, email, passwordHash, displayName);
      await newUser.save();

      req.flash("success_msg", "Đăng ký thành công! Bạn có thể đăng nhập.");
      res.redirect("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      req.flash("error_msg", "Đã xảy ra lỗi. Vui lòng thử lại.");
      res.redirect("/register");
    }
  },

  // Hiển thị trang đăng nhập
  getLogin: (req, res) => {
    res.render("login", { title: "Login", error_msg: req.flash("error") });
  },

  // Xử lý đăng nhập người dùng
  postLogin: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Kiểm tra các trường bắt buộc
      if (!email || !password) {
        req.flash("error_msg", "Vui lòng điền vào tất cả các trường.");
        return res.redirect("/login");
      }

      // Tìm người dùng theo email
      const user = await User.findByEmail(email);
      if (!user) {
        req.flash("error_msg", "Email hoặc mật khẩu không chính xác.");
        return res.redirect("/login");
      }

      // So sánh mật khẩu
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        req.flash("error_msg", "Email hoặc mật khẩu không chính xác.");
        return res.redirect("/login");
      }

      // Tạo session
      req.session.user = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };

      req.flash("success_msg", "Đăng nhập thành công!");
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);
      req.flash("error_msg", "Đã xảy ra lỗi. Vui lòng thử lại.");
      res.redirect("/login");
    }
  },

  // Xử lý đăng xuất
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) console.error("Error during logout:", err);
      res.redirect("/login");
    });
  },
};

module.exports = authController;
