const {
  studentLogin,
} = require('./student_login');
const {
  registerStudent,
} = require('./student_registration');
const {
  updateStudentPersonalInfo,
} = require('./personal_info');
const {
  studentAdmission,
} = require('./admission');
const {
  updateStudentProfileImg,
  updateStudentSignatureImg,
  studentVerificationDocument,
} = require('./uploads');
const {
  checkStatus,
} = require('./admission_status');
const {
  forgotPassword,
  changePassword,
} = require('./forgot_password');


module.exports = {
  studentLogin,
  registerStudent,
  updateStudentPersonalInfo,
  updateStudentProfileImg,
  updateStudentSignatureImg,
  studentAdmission,
  studentVerificationDocument,
  checkStatus,
  forgotPassword,
  changePassword,
};
