// @ts-check
const { Router } = require('express');

const { getBranchesController, getAdmissionController } = require('../controller/info');

const router = Router();

// GET all branches
router.get('/branches', getBranchesController);

// Get admission info
router.get('/admission', getAdmissionController);

module.exports = router;
