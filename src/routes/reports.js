const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { ensureAuth, ensureRole } = require('../middleware/auth');

router.get('/', ensureAuth, ensureRole(['admin', 'registry_officer', 'management']), reportController.getReports);
router.get('/generate', ensureAuth, ensureRole(['admin', 'registry_officer', 'management']), reportController.generateReport);

module.exports = router;
