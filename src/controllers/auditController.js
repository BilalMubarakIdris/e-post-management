const AuditLog = require('../models/AuditLog');

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('user', 'fullName username')
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.render('audit/index', {
      title: 'Audit Logs',
      logs
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error fetching audit logs');
    res.redirect('/dashboard');
  }
};
