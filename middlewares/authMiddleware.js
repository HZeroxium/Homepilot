// middlewares/authMiddleware.js

// Kiểm tra xem người dùng đã đăng nhập chưa
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  req.flash("error_msg", "Vui lòng đăng nhập để tiếp tục.");
  res.redirect("/login");
}

// Chuyển hướng người dùng đã đăng nhập khỏi trang đăng ký/đăng nhập
function forwardAuthenticated(req, res, next) {
  if (!req.session || !req.session.user) {
    return next();
  }
  res.redirect("/dashboard");
}

module.exports = {
  ensureAuthenticated,
  forwardAuthenticated,
};
