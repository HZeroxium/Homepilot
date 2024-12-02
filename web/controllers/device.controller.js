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

      const historicalData = await DeviceService.getHistoricalData(device, 20);

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
    res.render('devices/add_device', {
      title: 'Add Device',
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg'),
    });
  },

  async postAddDevice(req, res) {
    const userId = req.session.user.uid;
    const { type, name } = req.body;

    try {
      if (!type || !name) {
        req.flash('error_msg', 'Please provide all required fields.');
        return res.redirect('/devices/add');
      }

      await DeviceService.createDevice(userId, type, name);
      req.flash('success_msg', 'Device added successfully.');
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error adding device:', error);
      req.flash('error_msg', 'An error occurred while adding the device.');
      res.redirect('/devices/add');
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

      await DeviceService.deleteDevice(device);
      req.flash('success_msg', 'Device deleted successfully.');
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error in deleteDevice:', error);
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
};

export default deviceController;
