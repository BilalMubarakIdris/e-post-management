const express = require('express');
const router = express.Router();
const correspondenceController = require('../controllers/correspondenceController');
const { ensureAuth, ensureRole } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

router.get('/', ensureAuth, correspondenceController.getAll);
router.get('/assign/:id', ensureAuth, ensureRole(['admin', 'registry_officer']), correspondenceController.getAssign);
router.post('/assign/:id', ensureAuth, ensureRole(['admin', 'registry_officer']), logAudit('Assign Correspondence'), correspondenceController.postAssign);
router.get('/forward/:id', ensureAuth, correspondenceController.getForward);
router.post('/forward/:id', ensureAuth, logAudit('Forward Correspondence'), correspondenceController.postForward);
router.post('/update-status/:id', ensureAuth, logAudit('Update Correspondence Status'), correspondenceController.updateStatus);
router.get('/tracking/:trackingNumber', ensureAuth, correspondenceController.trackByNumber);

module.exports = router;
