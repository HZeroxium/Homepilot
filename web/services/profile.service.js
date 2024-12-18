// services/profile.service.js

import User from '../models/user.model.js';

class ProfileService {
  static async updateProfile(
    userId,
    newEmail,
    newPhoneDeviceID,
    newPhonePrivateKey
  ) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found.');
    }

    if (newPhoneDeviceID && newPhonePrivateKey) {
      user.updatePhoneDetails(newPhoneDeviceID, newPhonePrivateKey);
    }

    if (newEmail) {
      if (newEmail === user.email) {
        return true;
      }
      const existingUser = await User.findByEmail(newEmail);
      if (existingUser || newEmail === user.email) {
        throw new Error('Email already in use.');
      }
      user.updateEmail(newEmail);
    }

    return true;
  }
  static async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }
}

export default ProfileService;
