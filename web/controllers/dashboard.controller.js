import DashboardService from '../services/dashboard.service.js';

const dashboardController = {
  async getDashboard(req, res, next) {
    try {
      // Fetch devices for the logged-in user
      const devices = await DashboardService.getUserDevices(
        req.session.user.uid
      );

      // Render the dashboard page
      res.render('dashboard', {
        user: req.session.user,
        devices,
      });
    } catch (error) {
      console.error('Error in getDashboard:', error);
      next(error); // Pass the error to the next middleware for centralized handling
    }
  },
};

export default dashboardController;
