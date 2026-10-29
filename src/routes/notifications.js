const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { ensureAuth } = require('../middleware/auth');

router.get('/', ensureAuth, notificationController.getAll);
router.get('/read/:id', ensureAuth, notificationController.markRead);
router.get('/read-all', ensureAuth, notificationController.markAllRead);

module.exports = router;
