const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { ensureGuest, ensureAuth } = require('../middleware/auth');

router.get('/login', ensureGuest, authController.getLogin);
router.post('/login', ensureGuest, authController.postLogin);
router.get('/logout', ensureAuth, authController.logout);

module.exports = router;
