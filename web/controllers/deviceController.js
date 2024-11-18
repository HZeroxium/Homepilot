// controllers/deviceController.js

import Device from "../models/deviceModel.js";
import mqttClient from "../config/mqttConfig.js";

const deviceController = {
  /**
   * Display the device management page.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @param {Function} next - The next middleware function.
   */
  getDevicePage: async (req, res, next) => {
    const { deviceType } = req.params; // Extract device type from request parameters
    const userId = req.session.user.uid; // Get user ID from session

    try {
      // Retrieve device by user ID and device type
      const device = await Device.getDeviceByType(userId, deviceType);

      // Check if the device exists
      if (!device) {
        req.flash("error_msg", "Device does not exist.");
        return res.redirect("/dashboard");
      }

      let historicalData = [];
      // If the device is of type 'fire_smoke', fetch its historical data
      if (device.type === "fire_smoke") {
        historicalData = await device.getHistoricalData(20);
      }

      // Render the device management page with device details and historical data
      res.render(`devices/${deviceType}`, {
        device,
        historicalData,
        success_msg: req.flash("success_msg"),
        error_msg: req.flash("error_msg"),
      });
    } catch (error) {
      // Log error and pass it to the next middleware function
      console.error("Error in getDevicePage:", error);
      next(error);
    }
  },

  /**
   * Handle device actions.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @param {Function} next - The next middleware function.
   */
  postDeviceAction: async (req, res, next) => {
    const { deviceType } = req.params; // Extract device type from request parameters
    const { action } = req.body; // Extract the action to be performed from the request body
    const userId = req.session.user.uid; // Get user ID from session

    try {
      // Retrieve the device by user ID and device type
      const device = await Device.getDeviceByType(userId, deviceType);

      // Check if the device exists
      if (!device) {
        req.flash("error_msg", "Device does not exist.");
        return res.redirect("/dashboard");
      }

      // Define the topic and message for MQTT publish
      const topic = `home/${userId}/${deviceType}/${device.uid}/command`;
      const message = JSON.stringify({ deviceId: device.uid, action });

      // Publish the command to the device via MQTT
      mqttClient.publish(topic, message, { qos: 1 }, async (err) => {
        if (err) {
          console.error("Error publishing to MQTT:", err);
          req.flash("error_msg", "Failed to send command to the device.");
        } else {
          req.flash("success_msg", "Command sent to the device.");

          // Log the activity for the device
          await device.logActivity(action, userId);
        }
        // Redirect to the device management page
        res.redirect(`/devices/${deviceType}`);
      });
    } catch (error) {
      console.error("Error in postDeviceAction:", error);
      next(error);
    }
  },

  /**
   * Display the Add Device page.
   * @param {Object} req The HTTP request object.
   * @param {Object} res The HTTP response object.
   */
  getAddDevicePage: (req, res) => {
    // Render the add_device page with the title and any flash messages
    res.render("devices/add_device", {
      title: "Add Device",
      success_msg: req.flash("success_msg"),
      error_msg: req.flash("error_msg"),
    });
  },


  /**
   * Handle adding a new device.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   */
  postAddDevice: async (req, res) => {
    const userId = req.session.user.uid;
    const { type, name } = req.body;

    try {
      // Check if all required fields are provided
      if (!type || !name) {
        req.flash("error_msg", "Please provide all required fields.");
        return res.redirect("/devices/add");
      }

      // Create a new device
      const device = await Device.createDevice(userId, type, name);

      // Log the activity for the device
      await device.logActivity("added", userId);

      // Flash a success message and redirect to the dashboard
      req.flash("success_msg", "Device added successfully.");
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error adding device:", error);
      // Flash an error message and redirect to the add device page
      req.flash("error_msg", "An error occurred while adding the device.");
      res.redirect("/devices/add");
    }
  },

  /**
   * Display the Edit Device page.
   * @param {Object} req The HTTP request object.
   * @param {Object} res The HTTP response object.
   * @param {Function} next The next middleware function.
   */
  getEditDevicePage: async (req, res, next) => {
    const { deviceId } = req.params;
    const userId = req.session.user.uid;

    try {
      // Retrieve the device by its ID
      const device = await Device.getDeviceById(deviceId);

      // Check if the device exists and the user has access to it
      if (!device || device.userId !== userId) {
        // Flash an error message if the device does not exist or the user does not have access
        req.flash(
          "error_msg",
          "Device does not exist or you do not have access."
        );
        return res.redirect("/dashboard");
      }

      // Render the edit device page with the device details
      res.render("devices/edit_device", {
        title: "Edit Device",
        device,
        success_msg: req.flash("success_msg"),
        error_msg: req.flash("error_msg"),
      });
    } catch (error) {
      console.error("Error in getEditDevicePage:", error);
      // Pass the error to the next middleware function
      next(error);
    }
  },

  /**
   * Handle editing a device.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @param {Function} next - The next middleware function.
   */
  postEditDevice: async (req, res, next) => {
    const { deviceId } = req.params;
    const userId = req.session.user.uid;
    const { name, type } = req.body;

    try {
      // Retrieve the device by its ID
      const device = await Device.getDeviceById(deviceId);

      if (!device || device.userId !== userId) {
        // Flash an error message if the device does not exist or the user does not have access
        req.flash(
          "error_msg",
          "Device does not exist or you do not have access."
        );
        return res.redirect("/dashboard");
      }

      // Check if all required fields are provided
      if (!name || !type) {
        // Flash an error message if any of the required fields are missing
        req.flash("error_msg", "Please provide all required fields.");
        return res.redirect(`/devices/${deviceId}/edit`);
      }

      // Update the device
      await device.updateDeviceInfo({ name, type });

      // Flash a success message
      req.flash("success_msg", "Device updated successfully.");
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error in postEditDevice:", error);
      // Pass the error to the next middleware function
      next(error);
    }
  },

  /**
   * Handle deleting a device.
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @param {Function} next - The next middleware function.
   */
  deleteDevice: async (req, res, next) => {
    const { deviceId } = req.params;
    const userId = req.session.user.uid;

    try {
      // Retrieve the device by its ID
      const device = await Device.getDeviceById(deviceId);

      // Check if the device exists and the user has access to it
      if (!device || device.userId !== userId) {
        req.flash(
          "error_msg",
          "Device does not exist or you do not have access."
        );
        return res.redirect("/dashboard");
      }

      // Delete the device
      await device.delete();
      req.flash("success_msg", "Device deleted successfully.");
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error in deleteDevice:", error);
      // Pass the error to the next middleware function
      next(error);
    }
  },

  /**
   * Display Change Password page for access control devices.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @param {Function} next - The next middleware function.
   */
  getChangePasswordPage: async (req, res, next) => {
    const userId = req.session.user.uid;
    const deviceType = "access_control";

    try {
      // Retrieve the access control device by its type
      const device = await Device.getDeviceByType(userId, deviceType);

      // Check if the device exists
      if (!device) {
        // Flash an error message if the device does not exist
        req.flash("error_msg", "Device does not exist.");
        return res.redirect("/dashboard");
      }

      // Render the change password page with the device details
      res.render("devices/change_password", {
        device,
        success_msg: req.flash("success_msg"),
        error_msg: req.flash("error_msg"),
      });
    } catch (error) {
      console.error("Error in getChangePasswordPage:", error);
      // Pass the error to the next middleware function
      next(error);
    }
  },


  /**
   * Handle changing the password for access control devices.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @param {Function} next - The next middleware function.
   */
  postChangePassword: async (req, res, next) => {
    const userId = req.session.user.uid;
    const deviceType = "access_control";
    const { newPassword, confirmPassword } = req.body;

    try {
      // Retrieve the access control device by its type
      const device = await Device.getDeviceByType(userId, deviceType);

      if (!device) {
        req.flash("error_msg", "Device does not exist.");
        return res.redirect("/dashboard");
      }

      if (!newPassword || newPassword !== confirmPassword) {
        req.flash("error_msg", "Passwords do not match.");
        return res.redirect("/devices/access_control/change_password");
      }

      // Update the password in the database
      await device.updatePassword(newPassword);

      // Publish a command to the device to update the password
      const topic = `home/${userId}/access_control/${device.uid}/command`;
      const message = JSON.stringify({
        deviceId: device.uid,
        action: "update_pin",
        parameters: newPassword,
      });

      // Use MQTT to communicate with the device
      mqttClient.publish(topic, message, { qos: 1 }, async (err) => {
        if (err) {
          console.error("Error publishing to MQTT:", err);
          req.flash("error_msg", "Failed to send command to the device.");
        } else {
          req.flash("success_msg", "Password updated successfully.");
        }
        res.redirect("/devices/access_control");
      });
    } catch (error) {
      console.error("Error in postChangePassword:", error);
      // Pass the error to the next middleware function
      next(error);
    }
  },
};

export default deviceController;
