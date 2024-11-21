const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");
const dashboardRoutes = require("./dashboard");
const devicesRoutes = require("./devices");
const { ensureAuthenticated } = require("../middlewares/authMiddleware");

// Define the chatbot route
router.get("/chatbot", (req, res) => {
  res.render("chatbot", { user: req.session.user || null });
});

// Other routes
router.use("/", authRoutes);
router.use("/dashboard", ensureAuthenticated, dashboardRoutes);
router.use("/devices", ensureAuthenticated, devicesRoutes);

// Catch-all route for non-existent routes (404)
router.use((req, res) => {
  res.status(404).render("errors/404", {
    title: "404 - Page Not Found",
    message: "The page you are looking for does not exist.",
  });
});

module.exports = router;
