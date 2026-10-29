const AuditLog = require('../models/AuditLog');

const logAudit = (action, details = '') => {
  return async (req, res, next) => {
    try {
      if (req.session && req.session.userId) {
        await AuditLog.create({
          user: req.session.userId,
          action,
          details,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent'),
          resource: req.originalUrl
        });
      }
    } catch (error) {
      console.error('Audit log error:', error);
    }
    next();
  };
};

module.exports = { logAudit };
