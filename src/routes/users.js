const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { ensureAuth, ensureRole } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

router.get('/', ensureAuth, ensureRole(['admin']), userController.getAllUsers);
router.get('/add', ensureAuth, ensureRole(['admin']), userController.getAddUser);
router.post('/add', ensureAuth, ensureRole(['admin']), logAudit('Create User'), userController.postAddUser);
router.get('/edit/:id', ensureAuth, ensureRole(['admin']), userController.getEditUser);
router.put('/edit/:id', ensureAuth, ensureRole(['admin']), logAudit('Update User'), userController.putEditUser);
router.delete('/delete/:id', ensureAuth, ensureRole(['admin']), logAudit('Delete User'), userController.deleteUser);
router.get('/toggle/:id', ensureAuth, ensureRole(['admin']), logAudit('Toggle User Status'), userController.toggleUserStatus);

module.exports = router;
