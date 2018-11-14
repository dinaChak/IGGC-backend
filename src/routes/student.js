const { Router } = require('express');

const { registration } = require('../controller/student');

const router = Router();

router.post('/registration', registration);

module.exports = router;
