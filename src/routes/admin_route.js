const { Router } = require('express');

const { createBranchController } = require('../controller/admin_controller');
const { createBranchValidation } = require('../middleware/validationAndSanitization');

const router = Router();

// POST create new Branch
router.post('/branch/create', createBranchValidation, createBranchController);

module.exports = router;
