// routes/index.js

import express from "express";
import authRoutes from "./auth.js";
import dashboardRoutes from "./dashboard.js";
import devicesRoutes from "./devices.js";
import chatbotRoutes from "./chatbot.js";
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Other routes
router.use("/", authRoutes);
router.use("/dashboard", ensureAuthenticated, dashboardRoutes);
router.use("/devices", ensureAuthenticated, devicesRoutes);
router.use("/chatbot", ensureAuthenticated, chatbotRoutes);

// Handle non-existent routes
router.use((req, res) => {
  res.status(404).render("errors/404", {
    title: "404 - Page Not Found",
    message: "The page you are looking for does not exist.",
  });
});

export default router;
