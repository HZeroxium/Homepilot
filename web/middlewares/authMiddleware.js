// middlewares/authMiddleware.js

/**
 * Middleware to check if the user is authenticated before allowing them to access certain routes.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
function ensureAuthenticated(req, res, next) {
  // Check if the user has a valid session with an associated user
  if (req.session && req.session.user) {
    // User is authenticated, so continue to the next middleware
    return next();
  }

  // User is not authenticated, so flash an error message and redirect to login
  req.flash('error_msg', 'Please log in to continue.');
  res.redirect('/login');
}

/**
 * Middleware to forward unauthenticated users to the login page.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
function forwardAuthenticated(req, res, next) {
  // Check if the user is authenticated (i.e. they have a valid session with an associated user)
  if (!req.session || !req.session.user) {
    // User is not authenticated, so continue to the next middleware
    return next();
  }

  // User is authenticated, so forward them to the dashboard
  res.redirect('/dashboard');
}

export { ensureAuthenticated, forwardAuthenticated };
