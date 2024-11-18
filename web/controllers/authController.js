// controllers/authController.js

import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import User from "../models/userModel.js";

const authController = {
  /**
   * Display the Register page.
   * @param {Object} req The HTTP request object.
   * @param {Object} res The HTTP response object.
   */
  getRegister: (req, res) => {
    res.render("register", { error_msg: req.flash("error_msg") });
  },

  /**
   * Handle user registration.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   */
  postRegister: async (req, res) => {
    const { displayName, email, password, confirmPassword } = req.body;

    try {
      // Ensure all fields are provided
      if (!displayName || !email || !password || !confirmPassword) {
        req.flash("error_msg", "Please fill in all fields.");
        return res.redirect("/register");
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        req.flash("error_msg", "Passwords do not match.");
        return res.redirect("/register");
      }

      // Check if user with the provided email already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        req.flash("error_msg", "Email is already in use.");
        return res.redirect("/register");
      }

      // Generate password hash
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const uid = uuidv4();

      // Create and save new user
      const newUser = new User(uid, email, passwordHash, displayName);
      await newUser.save();

      // Registration successful
      req.flash("success_msg", "Registration successful! You can now log in.");
      res.redirect("/login");
    } catch (error) {
      // Handle errors during registration process
      console.error("Error during registration:", error);
      req.flash("error_msg", "An error occurred. Please try again.");
      res.redirect("/register");
    }
  },

  /**
   * Display the Login page.
   * @param {Object} req The HTTP request object.
   * @param {Object} res The HTTP response object.
   */
  getLogin: (req, res) => {
    res.render("login", { title: "Login", error_msg: req.flash("error") });
  },

  /**
   * Handle user login.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   */
  postLogin: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Ensure both email and password are provided
      if (!email || !password) {
        req.flash("error_msg", "Please fill in all fields.");
        return res.redirect("/login");
      }

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        req.flash("error_msg", "Incorrect email or password.");
        return res.redirect("/login");
      }

      // Compare provided password with the stored hash
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        req.flash("error_msg", "Incorrect email or password.");
        return res.redirect("/login");
      }

      // Store user information in session
      req.session.user = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };

      // Redirect to dashboard with a success message
      req.flash("success_msg", "Login successful!");
      res.redirect("/dashboard");
    } catch (error) {
      // Handle errors during login process
      console.error("Error during login:", error);
      req.flash("error_msg", "An error occurred. Please try again.");
      res.redirect("/login");
    }
  },

  /**
   * Log out the user by destroying the session.
   * @param {Object} req The HTTP request object.
   * @param {Object} res The HTTP response object.
   */
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error during logout:", err);
      }
      res.redirect("/login");
    });
  },

  /**
   * Save the FCM token for the authenticated user.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   */
  saveFcmToken: async (req, res) => {
    const userId = req.session.user.uid;
    const { fcmToken } = req.body;

    try {
      // Retrieve the user by ID
      const user = await User.findById(userId);

      if (user) {
        // Update the user's FCM token
        await user.updateFcmToken(fcmToken);
        res.status(200).json({ message: "FCM token saved" });
      } else {
        // User not found
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      // Handle errors during FCM token saving process
      console.error("Error saving FCM token:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default authController;
