// routes/index.js
const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");
const dashboardRoutes = require("./dashboard");
const devicesRoutes = require("./devices");
const { ensureAuthenticated } = require("../middlewares/authMiddleware");

router.use("/", authRoutes);
router.use("/dashboard", ensureAuthenticated, dashboardRoutes);
router.use("/devices", ensureAuthenticated, devicesRoutes);

// Xử lý route không tồn tại
router.use((req, res) => {
  res.status(404).render("errors/404", {
    title: "404 - Page Not Found",
    message: "The page you are looking for does not exist.",
  });
});

module.exports = router;
