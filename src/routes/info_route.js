// @ts-check
const { Router } = require('express');

const { getBranchesController, getAdmission } = require('../controller/info');

const router = Router();

// GET all branches
router.get('/branches', getBranchesController);

// Get admission info
router.get('/admission', getAdmission);

module.exports = router;
