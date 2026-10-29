const ensureAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  req.flash('error_msg', 'Please log in to access this page');
  res.redirect('/auth/login');
};

const ensureGuest = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }
  next();
};

const ensureRole = (roles) => {
  return (req, res, next) => {
    if (!req.session.userRole) {
      req.flash('error_msg', 'Unauthorized access');
      return res.redirect('/dashboard');
    }
    if (roles.includes(req.session.userRole)) {
      return next();
    }
    req.flash('error_msg', 'You do not have permission to access this page');
    res.redirect('/dashboard');
  };
};

module.exports = { ensureAuth, ensureGuest, ensureRole };
