const { studentRegistrationValidation } = require('./registration');
const { studentLoginValidation } = require('./login');
const { studentPersonalInfoValidation } = require('./personal_info');
const { studentAdmissionValidation } = require('./admission');
const { studentVerificationDocumentValidation } = require('./verification_document');
const { uploadValidation } = require('./upload');
const {
  forgotPasswordValidation,
  changePasswordValidation,
} = require('./forgot_password');

module.exports = {
  studentRegistrationValidation,
  studentLoginValidation,
  studentPersonalInfoValidation,
  studentAdmissionValidation,
  studentVerificationDocumentValidation,
  uploadValidation,
  forgotPasswordValidation,
  changePasswordValidation,
};
