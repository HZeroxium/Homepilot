// controllers/auth.controller.js
import AuthService from '../services/auth.service.js';

const authController = {
  getRegister: (req, res) => {
    res.render('register', { error_msg: req.flash('error_msg') });
  },

  postRegister: async (req, res) => {
    const { displayName, email, password, confirmPassword } = req.body;

    try {
      await AuthService.registerUser(
        displayName,
        email,
        password,
        confirmPassword
      );
      req.flash('success_msg', 'Registration successful! You can now log in.');
      res.redirect('/login');
    } catch (error) {
      console.error('Error during registration:', error);
      req.flash('error_msg', error.message);
      res.redirect('/register');
    }
  },

  getLogin: (req, res) => {
    res.render('login', { title: 'Login', error_msg: req.flash('error_msg') });
  },

  postLogin: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await AuthService.loginUser(email, password);
      req.session.user = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };
      req.flash('success_msg', 'Login successful!');
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
      req.flash('error_msg', error.message);
      res.redirect('/login');
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
