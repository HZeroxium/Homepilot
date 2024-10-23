// models/userModel.js

const { db } = require("../config/firebaseConfig");
const bcrypt = require("bcryptjs");

const usersCollection = db.collection("users");

class User {
  constructor(uid, email, passwordHash, displayName, createdAt) {
    this.uid = uid;
    this.email = email;
    this.passwordHash = passwordHash;
    this.displayName = displayName;
    this.createdAt = createdAt || new Date();
  }

  // Lưu người dùng vào Firestore
  async save() {
    try {
      await usersCollection.doc(this.uid).set({
        email: this.email,
        passwordHash: this.passwordHash,
        displayName: this.displayName,
        createdAt: this.createdAt,
      });
      return true;
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  }

  // Tìm người dùng theo email
  static async findByEmail(email) {
    try {
      const querySnapshot = await usersCollection
        .where("email", "==", email)
        .limit(1)
        .get();
      if (querySnapshot.empty) {
        return null;
      }
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return new User(
        doc.id,
        data.email,
        data.passwordHash,
        data.displayName,
        data.createdAt
      );
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  // So sánh mật khẩu
  async comparePassword(password) {
    try {
      return await bcrypt.compare(password, this.passwordHash);
    } catch (error) {
      console.error("Error comparing password:", error);
      throw error;
    }
  }

  // // Lưu FCM Token
  // async updateFcmToken(fcmToken) {
  //   try {
  //     await usersCollection.doc(this.uid).update({ fcmToken });
  //     this.fcmToken = fcmToken;
  //   } catch (error) {
  //     console.error("Error updating FCM token:", error);
  //     throw error;
  //   }
  // }

  // // Tìm người dùng theo ID
  // static async findById(uid) {
  //   try {
  //     const doc = await usersCollection.doc(uid).get();
  //     if (!doc.exists) {
  //       return null;
  //     }
  //     const data = doc.data();
  //     return new User(
  //       uid,
  //       data.email,
  //       data.passwordHash,
  //       data.displayName,
  //       data.createdAt,
  //       data.fcmToken
  //     );
  //   } catch (error) {
  //     console.error("Error finding user by ID:", error);
  //     throw error;
  //   }
  // }
}

module.exports = User;
