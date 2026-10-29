const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { ensureAuth, ensureRole } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');

router.get('/', ensureAuth, ensureRole(['admin']), departmentController.getAllDepartments);
router.get('/add', ensureAuth, ensureRole(['admin']), departmentController.getAddDepartment);
router.post('/add', ensureAuth, ensureRole(['admin']), logAudit('Create Department'), departmentController.postAddDepartment);
router.get('/edit/:id', ensureAuth, ensureRole(['admin']), departmentController.getEditDepartment);
router.put('/edit/:id', ensureAuth, ensureRole(['admin']), logAudit('Update Department'), departmentController.putEditDepartment);
router.delete('/delete/:id', ensureAuth, ensureRole(['admin']), logAudit('Delete Department'), departmentController.deleteDepartment);

module.exports = router;
