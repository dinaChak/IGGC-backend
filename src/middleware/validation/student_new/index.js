const { studentRegistrationValidation } = require('./registration');
const { studentLoginValidation } = require('./login');
const { studentPersonalInfoValidation } = require('./personal_info');
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
  studentVerificationDocumentValidation,
  uploadValidation,
  forgotPasswordValidation,
  changePasswordValidation,
};
