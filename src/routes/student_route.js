const { Router } = require('express');

const { registrationController, loginController, changeProfileImage } = require('../controller/student_controller');
const { studentRegistrationValidator, studentLoginValidation } = require('../middleware/validationAndSanitization');
const { isAuthenticStudent } = require('../middleware/authentication');

const router = Router();


// POST student registration.
router.post('/registration', studentRegistrationValidator, registrationController);

// POST student login.
router.post('/login', studentLoginValidation, loginController);

// POST change student profile image.
router.post('/profileimage/change', isAuthenticStudent, changeProfileImage);

module.exports = router;
