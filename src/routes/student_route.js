// @ts-check
const { Router } = require('express');

const { registrationController, loginController } = require('../controller/student_controller');
const { studentRegistrationValidator, studentLoginValidation } = require('../middleware/validationAndSanitization');

const router = Router();


// POST student registration.
router.post('/registration', studentRegistrationValidator, registrationController);

// POST student login.
router.post('/login', studentLoginValidation, loginController);


module.exports = router;
