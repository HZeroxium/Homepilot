// routes/devices.route.js

import express from 'express';
import deviceController from '../controllers/device.controller.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply ensureAuthenticated middleware to all routes
router.use(ensureAuthenticated);

// Display Add Device Page
router.get('/add', deviceController.getAddDevicePage);

// Handle Add Device
router.post('/add', deviceController.postAddDevice);

// Display Edit Device Page
router.get('/:deviceId/edit', deviceController.getEditDevicePage);

// Handle Edit Device
router.post('/:deviceId/edit', deviceController.postEditDevice);

// Handle Delete Device
router.delete('/:deviceId/delete', deviceController.deleteDevice);

// Display Device Management Page
router.get('/:deviceType', deviceController.getDevicePage);

// Handle Device Actions
router.post('/:deviceType/action', deviceController.postDeviceAction);

// Default redirect
router.get('/', (req, res) => {
  res.redirect('/dashboard');
});

// Display Change Password Page
router.get(
  '/access_control/change_password',
  deviceController.getChangePassword
);

// Handle Change Password
router.post(
  '/access_control/change_password',
  deviceController.postChangePassword
);

export default router;
