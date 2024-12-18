// controllers/profileController.js
import ProfileService from '../services/profile.service.js';

const profileController = {
  async getProfilePage(req, res) {
    const userID = req.session.user.uid;
    const email = await ProfileService.getUserProfile(userID);
    res.render('profile', { userID: userID, email: email });
  },

  async updateProfile(req, res) {
    const { newEmail, newPhoneDeviceID, newPhonePrivateKey } = req.body;
    const userID = req.session.user.uid;
    const email = await ProfileService.getUserProfile(userID);

    try {
      // Attempt to update the profile in the database
      await ProfileService.updateProfile(
        userID,
        newEmail,
        newPhoneDeviceID,
        newPhonePrivateKey
      );

      // After updating, redirect the user to the profile page
      res.redirect('/profile'); // Use the correct URL path for redirecting
    } catch (error) {
      // In case of an error, render the profile page with the original user data
      res.render('profile', { userID: userID, email: email });

      // Optionally, you can handle the error message as a flash message or something else
      return res.status(400).send(error.message); // Send error response if necessary
    }
  },
};
export default profileController;
