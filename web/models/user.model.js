// models/user.model.js
import { db } from "../config/firebaseConfig.js";
import bcrypt from "bcryptjs";

const usersCollection = db.collection("users");

class User {
  constructor(uid, email, passwordHash, displayName, createdAt, phoneDeviceID, phonePrivateKey, fcmToken) {
    this.uid = uid;
    this.email = email;
    this.passwordHash = passwordHash;
    this.displayName = displayName;
    this.createdAt = createdAt || new Date();
    this.phoneDeviceID = phoneDeviceID || null;
    this.phonePrivateKey = phonePrivateKey || null;
    this.fcmToken = fcmToken || null;
  }

  async save() {
    try {
      await usersCollection.doc(this.uid).set({
        email: this.email,
        passwordHash: this.passwordHash,
        displayName: this.displayName,
        createdAt: this.createdAt,
        phoneDeviceID: this.phoneDeviceID,
        phonePrivateKey: this.phonePrivateKey,
        fcmToken: this.fcmToken,
      });
      return true;
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const querySnapshot = await usersCollection
        .where("email", "==", email)
        .limit(1)
        .get();

      if (querySnapshot.empty) return null;

      const doc = querySnapshot.docs[0];
      const data = doc.data();

      return new User(
        doc.id,
        data.email,
        data.passwordHash,
        data.displayName,
        data.createdAt,
        data.phoneDeviceID,
        data.phonePrivateKey,
        data.fcmToken
      );
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  async comparePassword(password) {
    try {
      return await bcrypt.compare(password, this.passwordHash);
    } catch (error) {
      console.error("Error comparing password:", error);
      throw error;
    }
  }

  async updateFcmToken(fcmToken) {
    try {
      await usersCollection.doc(this.uid).update({ fcmToken });
      this.fcmToken = fcmToken;
    } catch (error) {
      console.error("Error updating FCM token:", error);
      throw error;
    }
  }

  static async findById(uid) {
    try {
      const doc = await usersCollection.doc(uid).get();

      if (!doc.exists) return null;

      const data = doc.data();

      return new User(
        uid,
        data.email,
        data.passwordHash,
        data.displayName,
        data.createdAt,
        data.phoneDeviceID,
        data.phonePrivateKey,
        data.fcmToken
      );
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  }

  async updateEmail(newEmail) {
    try {
      // Check if the new email already exists
      const existingUser = await User.findByEmail(newEmail);
      if (existingUser) {
        throw new Error("Email already in use by another account.");
      }

      await usersCollection.doc(this.uid).update({ email: newEmail });
      this.email = newEmail;
    } catch (error) {
      console.error("Error updating email:", error);
      throw error;
    }
  }

  async updatePhoneDetails(phoneDeviceID, phonePrivateKey) {
    try {
      await usersCollection.doc(this.uid).update({
        phoneDeviceID,
        phonePrivateKey,
      });
      this.phoneDeviceID = phoneDeviceID;
      this.phonePrivateKey = phonePrivateKey;
    } catch (error) {
      console.error("Error updating phone details:", error);
      throw error;
    }
  }
}

export default User;
