const { Router } = require('express');

const { getBranchesController } = require('../controller/branch_controller');

const router = Router();

// GET all branches
router.get('/', getBranchesController);

module.exports = router;