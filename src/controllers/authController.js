const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

exports.getLogin = (req, res) => {
  res.render('auth/login', { title: 'Login - E-Post Management System', layout: 'layouts/auth' });
};

exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      req.flash('error_msg', 'Please provide username and password');
      return res.redirect('/auth/login');
    }
    
    const user = await User.findOne({ username: username.toLowerCase() }).populate('department');
    
    if (!user) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/auth/login');
    }
    
    if (!user.isActive) {
      req.flash('error_msg', 'Your account has been deactivated. Please contact administrator.');
      return res.redirect('/auth/login');
    }
    
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/auth/login');
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Create session
    req.session.userId = user._id;
    req.session.userName = user.fullName;
    req.session.userRole = user.role;
    req.session.username = user.username;
    req.session.departmentId = user.department ? user.department._id : null;
    
    // Log audit
    await AuditLog.create({
      user: user._id,
      action: 'User Login',
      details: `User ${user.username} logged in`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });
    
    req.flash('success_msg', `Welcome back, ${user.fullName}!`);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error_msg', 'Something went wrong. Please try again. Error: ' + error.message);
    res.redirect('/auth/login');
  }
};

exports.logout = async (req, res) => {
  try {
    if (req.session.userId) {
      await AuditLog.create({
        user: req.session.userId,
        action: 'User Logout',
        details: `User logged out`,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      });
    }
    
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.redirect('/auth/login');
    });
  } catch (error) {
    console.error(error);
    res.redirect('/auth/login');
  }
};
