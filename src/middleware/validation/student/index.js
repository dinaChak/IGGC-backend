const { registrationValidation, loginValidation } = require('./student_registration_login');
const {
  updateStudentInfoValidation,
  updateStudentProfileValidation,
  updateStudentNameValidation,
} = require('./student_update');
const { semesterAdmissionValidation } = require('./semester_admission');

module.exports = {
  registrationValidation,
  loginValidation,
  updateStudentInfoValidation,
  updateStudentProfileValidation,
  updateStudentNameValidation,
  semesterAdmissionValidation,
};
