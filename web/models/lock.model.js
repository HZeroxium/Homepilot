import Device from '../models/device.model.js';

class Lock extends Device {
  constructor(uid, userId, type, name, status = 'offline', data = {}) {
    super(uid, userId, type, name, status, data);
  }

  /**
   * Updates the device's password.
   * @param {string} newPassword - The new plain text password to store.
   * @returns {Promise<void>} - Resolves when the password is updated.
   * @throws Will throw an error if there's an issue updating the password.
   */
  async updatePassword(newPassword) {
    try {
      // Update the stored password in the device document
      this.data.password = newPassword;
      // Update the password in the Firestore document
      await devicesCollection
        .doc(this.uid)
        .update({ 'data.password': newPassword });
    } catch (error) {
      // Log the error if password update fails
      console.error('Error updating device password:', error);
      // Propagate the error further
      throw error;
    }
  }

  /**
   * Compares the provided password with the stored device password.
   * Utilizes bcrypt to securely compare the password against the stored hash.
   * @param {string} inputPassword - The plain text password to compare.
   * @returns {Promise<boolean>} - Resolves to true if the password matches, false otherwise.
   * @throws Will throw an error if there's an issue during comparison.
   */
  async comparePassword(inputPassword) {
    try {
      // Compare the input password with the stored hashed password
      return await bcrypt.compare(inputPassword, this.data.password);
    } catch (error) {
      // Log the error if password comparison fails
      console.error('Error comparing device password:', error);
      // Propagate the error further
      throw error;
    }
  }
}

export default Lock;
