const { Router } = require('express');

const { createBranch } = require('../controller/admin_controller');

const router = Router();


router.post('/branch/create', createBranch);

module.exports = router;
