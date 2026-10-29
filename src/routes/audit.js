const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { ensureAuth, ensureRole } = require('../middleware/auth');

router.get('/', ensureAuth, ensureRole(['admin']), auditController.getAuditLogs);

module.exports = router;
