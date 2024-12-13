// middlewares/authMiddleware.js

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
