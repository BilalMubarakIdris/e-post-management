const express = require('express');
const router = express.Router();
const outgoingController = require('../controllers/outgoingController');
const { ensureAuth } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');
const upload = require('../middleware/upload');

router.get('/', ensureAuth, outgoingController.getAllOutgoing);
router.get('/add', ensureAuth, outgoingController.getAddOutgoing);
router.post('/add', ensureAuth, upload.array('attachments', 5), logAudit('Register Outgoing Correspondence'), outgoingController.postAddOutgoing);
router.get('/view/:id', ensureAuth, outgoingController.viewOutgoing);

module.exports = router;
