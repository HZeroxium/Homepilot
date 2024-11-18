// controllers/dashboardController.js

import Device from "../models/deviceModel.js";

const dashboardController = {

  /**
   * GET /dashboard
   * Display the dashboard page with a list of devices
   * @param {Object} req The HTTP request object.
   * @param {Object} res The HTTP response object.
   * @param {Function} next The next middleware function.
   */
  getDashboard: async (req, res, next) => {
    try {
      // Get a list of devices for the current user
      const devices = await Device.getDevicesByUserId(req.session.user.uid);

      // Render the dashboard page with the devices
      res.render("dashboard", {
        user: req.session.user,
        devices,
        success_msg: req.flash("success_msg"),
        error_msg: req.flash("error_msg"),
      });
    } catch (error) {
      console.error("Error in getDashboard:", error);
      // Pass the error to the next middleware function
      next(error);
    }
  },

};

export default dashboardController;
