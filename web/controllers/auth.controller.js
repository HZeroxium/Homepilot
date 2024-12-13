// controllers/auth.controller.js
import AuthService from '../services/auth.service.js';

const authController = {
  getRegister: (req, res) => {
    res.render('register', { title: 'Đăng ký' });
  },

  postRegister: async (req, res) => {
    const { displayName, email, password, confirmPassword } = req.body;

    try {
      // Call your registration service
      await AuthService.registerUser(
        displayName,
        email,
        password,
        confirmPassword
      );

      // Return success response
      res.status(200).json({
        success: true,
        message:
          'Registration successful! You can now log in. Redirecting in 3 seconds...',
      });
    } catch (error) {
      console.error('Error during registration:', error);

      // Return error response
      res.status(400).json({
        success: false,
        message: error.message || 'An error occurred during registration.',
      });
    }
  },

  getLogin: (req, res) => {
    res.render('login');
  },

  postLogin: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Authenticate the user
      const user = await AuthService.loginUser(email, password);

      // Set session data
      req.session.user = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };

      // Send success response
      res.status(200).json({
        success: true,
        message: 'Login successful! Redirecting in 3 seconds...',
        redirectUrl: '/dashboard',
      });
    } catch (error) {
      console.error('Error during login:', error);

      // Send error response
      res.status(400).json({
        success: false,
        message: error.message || 'Incorrect email or password.',
      });
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error during logout:', err);
      }
      res.redirect('/login');
    });
  },

  saveFcmToken: async (req, res) => {
    const userId = req.session.user.uid;
    const { fcmToken } = req.body;

    try {
      await AuthService.saveFcmToken(userId, fcmToken);
      res.status(200).json({ message: 'FCM token saved' });
    } catch (error) {
      console.error('Error saving FCM token:', error);
      res.status(500).json({ error: error.message });
    }
  },
};

export default authController;
