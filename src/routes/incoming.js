const express = require('express');
const router = express.Router();
const incomingController = require('../controllers/incomingController');
const { ensureAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');
const upload = require('../middleware/upload');

router.get('/', ensureAuth, incomingController.getAllIncoming);
router.get('/add', ensureAuth, incomingController.getAddIncoming);
router.post('/add', ensureAuth, upload.array('attachments', 5), logAudit('Register Incoming Correspondence'), incomingController.postAddIncoming);
router.get('/view/:id', ensureAuth, incomingController.viewIncoming);

module.exports = router;
