const { Router } = require('express');

const { registrationController, getBranches } = require('../controller/student_controller');
const { studentRegistrationValidator } = require('../middleware/validationAndSanitization');

const router = Router();

// GET all branches from DB.
router.get('/branches', getBranches);

router.post('/registration', studentRegistrationValidator, registrationController);



module.exports = router;
