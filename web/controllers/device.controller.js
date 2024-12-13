// controllers/device.controller.js

import DeviceService from '../services/device.service.js';

const deviceController = {
  async getDevicePage(req, res, next) {
    const { deviceType } = req.params;
    const userId = req.session.user.uid;

    try {
      const device = await DeviceService.getDeviceByType(userId, deviceType);
      if (!device) {
        req.flash('error_msg', 'Device does not exist.');
        return res.redirect('/dashboard');
      }

      console.log('Device:', device);

      const historicalData = await DeviceService.getHistoricalData(device, 20);

      // console.log('Historical Data: ', historicalData);

      console.log('Device Type:', deviceType);

      res.render(`devices/${deviceType}`, {
        device,
        historicalData,
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg'),
      });
    } catch (error) {
      console.error('Error in getDevicePage:', error);
      next(error);
    }
  },

  async postDeviceAction(req, res, next) {
    const { deviceType } = req.params;
    const { action } = req.body;
    const userId = req.session.user.uid;

    try {
      const device = await DeviceService.getDeviceByType(userId, deviceType);
      if (!device) {
        req.flash('error_msg', 'Device does not exist.');
        return res.redirect('/dashboard');
      }

      await DeviceService.publishToDevice(userId, device, action);
      req.flash('success_msg', 'Command sent to the device.');
      res.redirect(`/devices/${deviceType}`);
    } catch (error) {
      console.error('Error in postDeviceAction:', error);
      req.flash('error_msg', 'Failed to send command to the device.');
      res.redirect(`/devices/${deviceType}`);
    }
  },

  getAddDevicePage(req, res) {
    res.render('devices/add_device');
  },

  async postAddDevice(req, res) {
    const userId = req.session.user.uid;
    const { type, name } = req.body;

    try {
      // Validate required fields
      if (!type || !name) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields.',
        });
      }

      // Add the device using the service
      await DeviceService.createDevice(userId, type, name);

      // Send success response
      res
        .status(200)
        .json({ success: true, message: 'Devices added successfully.' });
    } catch (error) {
      console.error('Error adding device:', error);

      // Send error response
      res.status(500).json({
        success: false,
        message: `Failed to add device: ${error.message}`,
      });
    }
  },

  async getEditDevicePage(req, res, next) {
    const { deviceId } = req.params;
    const userId = req.session.user.uid;

    try {
      const device = await DeviceService.getDeviceById(deviceId);
      if (!device || device.userId !== userId) {
        req.flash(
          'error_msg',
          'Device does not exist or you do not have access.'
        );
        return res.redirect('/dashboard');
      }

      res.render('devices/edit_device', {
        title: 'Edit Device',
        device,
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg'),
      });
    } catch (error) {
      console.error('Error in getEditDevicePage:', error);
      next(error);
    }
  },

  async postEditDevice(req, res, next) {
    const { deviceId } = req.params;
    const userId = req.session.user.uid;
    const { name, type } = req.body;

    try {
      const device = await DeviceService.getDeviceById(deviceId);
      if (!device || device.userId !== userId) {
        req.flash(
          'error_msg',
          'Device does not exist or you do not have access.'
        );
        return res.redirect('/dashboard');
      }

      if (!name || !type) {
        req.flash('error_msg', 'Please provide all required fields.');
        return res.redirect(`/devices/${deviceId}/edit`);
      }

      await DeviceService.updateDeviceInfo(device, { name, type });
      req.flash('success_msg', 'Device updated successfully.');
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error in postEditDevice:', error);
      next(error);
    }
  },

  async deleteDevice(req, res, next) {
    const { deviceId } = req.params;
    console.log('deviceId:', deviceId);
    const userId = req.session.user.uid;

    try {
      const device = await DeviceService.getDeviceById(deviceId);
      if (!device || device.userId !== userId) {
        res
          .status(403)
          .json({ error: 'You do not have permission to delete this device.' });
      }

      await DeviceService.deleteDevice(device);
      res.status(200).json({ message: 'Device deleted successfully.' });
    } catch (error) {
      console.error('Error in deleteDevice:', error);
      res.status(500).json({ message: error.message });
      next(error);
    }
  },

  getChangePassword: async (req, res, next) => {
    const userId = req.session.user.uid;
    const deviceType = 'access_control';

    try {
      // Retrieve the access control device by its type
      const device = await DeviceService.getDeviceByType(userId, deviceType);

      // Check if the device exists
      if (!device) {
        // Flash an error message if the device does not exist
        req.flash('error_msg', 'Device does not exist.');
        return res.redirect('/dashboard');
      }

      // Render the change password page with the device details
      res.render('devices/change_password', {
        device,
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg'),
      });
    } catch (error) {
      console.error('Error in getChangePasswordPage:', error);
      // Pass the error to the next middleware function
      next(error);
    }
  },

  async postChangePassword(req, res, next) {
    const userId = req.session.user.uid;
    const deviceType = 'access_control';
    const { newPassword, confirmPassword } = req.body;

    try {
      const device = await DeviceService.getDeviceByType(userId, deviceType);
      if (!device) {
        req.flash('error_msg', 'Device does not exist.');
        return res.redirect('/dashboard');
      }

      if (!newPassword || newPassword !== confirmPassword) {
        req.flash('error_msg', 'Passwords do not match.');
        return res.redirect('/devices/access_control/change_password');
      }

      await DeviceService.updateDevicePassword(device, newPassword);
      await DeviceService.publishToDevice(userId, device, 'update_pin', {
        newPassword,
      });

      req.flash('success_msg', 'Password updated successfully.');
      res.redirect('/devices/access_control');
    } catch (error) {
      console.error('Error in postChangePassword:', error);
      next(error);
    }
  },

  async postChangeDistance(req, res, next) {
    const userId = req.session.user.uid;
    const deviceType = 'intrusion';
    const { newDistance } = req.body;

    try {
      const device = await DeviceService.getDeviceByType(userId, deviceType);
      if (!device) {
        req.flash('error_msg', 'Device does not exist.');
        return res.redirect('/dashboard');
      }

      if (!newDistance || newDistance < 0 || newDistance > 200) {
        req.flash('error_msg', 'Please provide a valid distance.');
        return res.redirect('/devices/intrusion');
      }

      await DeviceService.updateDeviceDistance(device, newDistance);
      await DeviceService.publishToDevice(userId, device, 'update_distance', {
        newDistance,
      });

      req.flash('success_msg', 'Distance updated successfully.');
      res.redirect('/devices/intrusion');
    } catch (error) {
      console.error('Error in postChangeDistance:', error);
      next(error);
    }
  },
};

export default deviceController;
