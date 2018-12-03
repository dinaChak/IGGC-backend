// @ts-check
const { Router } = require('express');

const {
  registrationController, loginController, createBranchController, createAdmission,
} = require('../controller/admin_controller');
const {
  adminRegistrationValidation,
  adminLoginValidation,
  createBranchValidation,
  createAdmissionValidation,
} = require('../middleware/admin_validation_and_sanitization');
const { isAuthenticAdminRoleAdmin } = require('../middleware/authentication');

const router = Router();

// POST create new Branch
router.post('/branch/create', isAuthenticAdminRoleAdmin, createBranchValidation, createBranchController);

// POST create new admission
router.put('/admission/create', isAuthenticAdminRoleAdmin, createAdmissionValidation, createAdmission);


// POST Register new Admin
router.post('/register', adminRegistrationValidation, registrationController);

// POST admin login
router.post('/login', adminLoginValidation, loginController);

module.exports = router;
