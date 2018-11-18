// @ts-check
const { Router } = require('express');

const { registrationController, loginController, createBranchController } = require('../controller/admin_controller');
const { adminRegistrationValidation, adminLoginValidation, createBranchValidation } = require('../middleware/validationAndSanitization');

const router = Router();

// POST create new Branch
router.post('/branch/create', createBranchValidation, createBranchController);

// POST Register new Admin
router.post('/register', adminRegistrationValidation, registrationController);

// POST admin login
router.post('/login', adminLoginValidation, loginController);

module.exports = router;
