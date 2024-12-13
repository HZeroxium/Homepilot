import DashboardService from '../services/dashboard.service.js';

const dashboardController = {
  /**
   * GET /dashboard
   * Display the dashboard page with a list of devices.
   * @param {Object} req The HTTP request object.
   * @param {Object} res The HTTP response object.
   * @param {Function} next The next middleware function.
   */
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
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg'),
      });
    } catch (error) {
      console.error('Error in getDashboard:', error);
      next(error); // Pass the error to the next middleware for centralized handling
    }
  },
};

export default dashboardController;
