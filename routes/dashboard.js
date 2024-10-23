// routes/dashboard.js
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { ensureAuthenticated } = require("../middlewares/authMiddleware");

// Áp dụng middleware ensureAuthenticated cho tất cả các route trong router này
router.use(ensureAuthenticated);

// Hiển thị trang dashboard
router.get("/", dashboardController.getDashboard);

module.exports = router;
