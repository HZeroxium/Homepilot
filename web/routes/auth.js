// routes/auth.js

import express from "express";
import authController from "../controllers/authController.js";
import {
  forwardAuthenticated,
  ensureAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Save FCM Token
router.post(
  "/save-fcm-token",
  ensureAuthenticated,
  authController.saveFcmToken
);

// Display Register Page
router.get("/register", forwardAuthenticated, authController.getRegister);

// Handle User Registration
router.post("/register", forwardAuthenticated, authController.postRegister);

// Display Login Page
router.get("/login", forwardAuthenticated, authController.getLogin);

// Handle User Login
router.post("/login", forwardAuthenticated, authController.postLogin);

// Handle User Logout
router.get("/logout", authController.logout);

// Render Home Page
router.get("/", (req, res) => {
  res.render("index");
});

export default router;
