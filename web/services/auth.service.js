// services/auth.service.js
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/user.model.js';

class AuthService {
  static async registerUser(displayName, email, password, confirmPassword) {
    if (!displayName || !email || !password || !confirmPassword) {
      throw new Error('All fields are required. Please try again.');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match. Please try again.');
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('Email is already in use. Please use a different email.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const uid = uuidv4();

    const newUser = new User(uid, email, passwordHash, displayName);
    await newUser.save();
    return newUser;
  }

  static async loginUser(email, password) {
    if (!email || !password) {
      throw new Error('Both email and password are required.');
    }

    const user = await User.findByEmail(email);

    if (!user)
      throw new Error('Incorrect email. Please try again or register.');

    if (!(await user.comparePassword(password))) {
      throw new Error('Incorrect password. Please try again.');
    }

    return user;
  }

  static async saveFcmToken(userId, fcmToken) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    await user.updateFcmToken(fcmToken);
    return true;
  }
}

export default AuthService;
