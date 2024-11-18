// userModel.js

import { db } from "../config/firebaseConfig.js";
import bcrypt from "bcryptjs";

const usersCollection = db.collection("users");

class User {
  /**
   * Construct a new User object.
   * @param {string} uid - User's unique ID.
   * @param {string} email - User's email.
   * @param {string} passwordHash - The hash of the user's password.
   * @param {string} displayName - User's display name.
   * @param {Date} createdAt - Timestamp of when the user was created.
   */
  constructor(uid, email, passwordHash, displayName, createdAt) {
    /**
     * The user's unique ID.
     * @type {string}
     */
    this.uid = uid;

    /**
     * The user's email.
     * @type {string}
     */
    this.email = email;

    /**
     * The hash of the user's password.
     * @type {string}
     */
    this.passwordHash = passwordHash;

    /**
     * The user's display name.
     * @type {string}
     */
    this.displayName = displayName;

    /**
     * Timestamp of when the user was created.
     * @type {Date}
     */
    this.createdAt = createdAt || new Date();
  }

  /**
   * Save the user to Firestore.
   * @returns {Promise<boolean>} - Resolves to true if the user is saved successfully.
   * @throws Will throw an error if there is an issue during saving.
   */
  async save() {
    try {
      // Create or update the user document in Firestore
      await usersCollection.doc(this.uid).set({
        email: this.email, // Store the user's email
        passwordHash: this.passwordHash, // Store the hashed password
        displayName: this.displayName, // Store the display name
        createdAt: this.createdAt, // Store the creation timestamp
      });
      return true; // Return true if successful
    } catch (error) {
      // Log the error if saving fails
      console.error("Error saving user:", error);
      throw error; // Propagate the error
    }
  }

  /**
   * Find a user by their email address.
   * Queries the Firestore database for a user with a matching email.
   * @param {string} email - The email of the user to find.
   * @returns {Promise<User|null>} - A User object if found, otherwise null.
   * @throws Will throw an error if there is an issue with the Firestore query.
   */
  static async findByEmail(email) {
    try {
      // Query the users collection for a document with the specified email
      const querySnapshot = await usersCollection
        .where("email", "==", email)
        .limit(1)
        .get();

      // Check if the query result is empty
      if (querySnapshot.empty) {
        return null; // Return null if no user is found
      }

      // Extract the document from the query results
      const doc = querySnapshot.docs[0];
      // Retrieve the data from the document
      const data = doc.data();

      // Return a new User instance constructed with the document data
      return new User(
        doc.id, // User ID
        data.email, // User's email
        data.passwordHash, // User's password hash
        data.displayName, // User's display name
        data.createdAt // Timestamp of user creation
      );
    } catch (error) {
      // Log an error message if the query fails
      console.error("Error finding user by email:", error);
      // Propagate the error further
      throw error;
    }
  }

  /**
   * Compares a given password with the stored password hash.
   * Utilizes bcrypt to securely compare the password against the hash.
   * @param {string} password - The plain text password to compare.
   * @returns {Promise<boolean>} - Resolves to true if the password matches the hash, false otherwise.
   * @throws Will throw an error if there's an issue during comparison.
   */
  async comparePassword(password) {
    try {
      // Use bcrypt to compare the plain text password with the stored hash
      return await bcrypt.compare(password, this.passwordHash);
    } catch (error) {
      // Log an error message if there's an issue during comparison
      console.error("Error comparing password:", error);
      // Propagate the error further
      throw error;
    }
  }

  /**
   * Updates the user's FCM token in Firestore.
   * @param {string} fcmToken - The new FCM token to store.
   * @returns {Promise<void>} - Resolves when the token is updated.
   * @throws Will throw an error if there's an issue updating the token.
   */
  async updateFcmToken(fcmToken) {
    try {
      // Update the user's FCM token in Firestore
      await usersCollection.doc(this.uid).update({ fcmToken });

      // Update the user's FCM token property
      this.fcmToken = fcmToken;
    } catch (error) {
      // Log an error message if there's an issue updating the token
      console.error("Error updating FCM token:", error);
      // Propagate the error further
      throw error;
    }
  }

  /**
   * Find user by ID.
   * @param {string} uid - User's unique ID.
   * @returns {Promise<User|null>} - Resolves to the user if found, otherwise null.
   * @throws Will throw an error if there's an issue during the query.
   */
  static async findById(uid) {
    try {
      // Retrieve the user document by ID
      const doc = await usersCollection.doc(uid).get();

      // Check if the user exists
      if (!doc.exists) {
        return null;
      }

      // Extract the data from the document
      const data = doc.data();

      // Return a new User instance constructed with the document data
      return new User(
        uid, // User ID
        data.email, // User's email
        data.passwordHash, // User's password hash
        data.displayName, // User's display name
        data.createdAt, // Timestamp of user creation
        data.fcmToken // User's FCM token
      );
    } catch (error) {
      // Log an error message if there's an issue during the query
      console.error("Error finding user by ID:", error);
      // Propagate the error further
      throw error;
    }
  }
}

export default User;
