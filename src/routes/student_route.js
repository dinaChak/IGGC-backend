const { Router } = require('express');

const { registrationController, loginController, getBranchesController } = require('../controller/student_controller');
const { studentRegistrationValidator, studentLoginValidation } = require('../middleware/validationAndSanitization');

const router = Router();

// GET all branches from DB.
router.get('/branches', getBranchesController);

// POST student registration.
router.post('/registration', studentRegistrationValidator, registrationController);

// POST student login.
router.post('/login', studentLoginValidation, loginController);



module.exports = router;
