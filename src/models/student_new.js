const _ = require('lodash');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  path: String,
  fileName: String,
  baseDir: String,
  link: String,
});

const AddressSchema = new mongoose.Schema({
  vill_town: String,
  ps_po: String,
  state: String,
  district: String,
  pin: String,
});

const LastExaminationSchema = new mongoose.Schema({
  examination: String,
  board_uni: String,
  year_session: String,
  result: String,
  division: String,
  roll_no: String,
  total_mark: Number,
  percentage: Number,
  institution: String,
  subjects: [{
    title: String,
    mark: String,
  }],
});

const BankDetailSchema = new mongoose.Schema({
  name: String,
  branch: String,
  ac_no: String,
  IFSC_code: String,
});

const CategorySchema = new mongoose.Schema({
  type: String,
  name: String,
});

const SemesterSchema = new mongoose.Schema({
  subjects: [{ code: String, title: String }],
  number: Number,
  session: String,
});

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
  },
  date_of_birth: Date,
  phone_number: String,
  profile_image: FileSchema,
  signature_image: FileSchema,
  email: String,
  password: String,
  gender: String,
  fatherName: {
    type: String,
    lowercase: true,
  },
  motherName: {
    type: String,
    lowercase: true,
  },
  religion: String,
  category: CategorySchema,
  nationality: String,
  presentAddress: AddressSchema,
  permanentAddress: AddressSchema,
  bank_detail: BankDetailSchema,
  aadhaar_no: String,
  employed: Boolean,
  have_disability: Boolean,
  last_examination: LastExaminationSchema,
  school_uni_last_attended: String,
  uni_reg_no: String,
  uni_roll_no: String,
  class_roll_no: String,
  branch: String,
  semester: Number,
  semesters: [SemesterSchema],
  failed: {
    type: Boolean,
    default: false,
  },
  major_subject: String,
  subjectCombination: [{
    code: String,
    title: String,
  }],
  verification_documents: [{
    title: String,
    file: FileSchema,
  }],
  admissionStatus: {
    type: String,
    enum: ['applying', 'verification', 'verified', 'completed'],
    default: 'applying',
  },
}, {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

StudentSchema
  .virtual('profile_img')
  .get(function getImg() {
    return this.profile_image
      // ? this.profile_image.link
      ? `${process.env.HOSTNAME}/public/${this.profile_image.baseDir}/${this.profile_image.fileName}`
      : '';
  });

StudentSchema
  .virtual('signature_img')
  .get(function getImg() {
    return this.signature_image
      // ? this.signature_image.link
      ? `${process.env.HOSTNAME}/public/${this.signature_image.baseDir}/${this.signature_image.fileName}`
      : '';
  });

StudentSchema
  .virtual('verification_docs')
  .get(function getImg() {
    return this.verification_documents.map(doc => ({
      title: doc.title,
      // link: doc.file.link,
      link: `${process.env.HOSTNAME}/public/${doc.file.baseDir}/${doc.file.fileName}`,
    }));
  });

StudentSchema.index({
  name: 'text',
});

StudentSchema.methods.toJSON = function toJSON() {
  const student = this;
  const studentObject = student.toObject();

  return _.omit(studentObject, ['password', '__v']);
};

StudentSchema.pre('save', function hashPassword(next) {
  const student = this;

  if (student.isModified('password')) {
    bcrypt.genSalt(12, (err, salt) => {
      // eslint-disable-next-line
      bcrypt.hash(student.password, salt, (err, hash) => {
        student.password = hash;
        next();
      });
    });
  } else next();
});

// StudentSchema.pre('update', function hashPassword(next) {
//   const student = this;
//   console.log('updateeeeeeeeeeed!!!!!!!!!!!!!!!!!!!!!!!!', student);

//   if (student.isModified('password')) {
//     bcrypt.genSalt(12, (err, salt) => {
//       // eslint-disable-next-line
//       bcrypt.hash(student.password, salt, (err, hash) => {
//         student.password = hash;
//         next();
//       });
//     });
//   } else next();
// });


StudentSchema.statics.findByCredentials = async function findByCredentials(phoneNo, password) {
  try {
    const student = await this.findOne({
      phone_number: phoneNo,
    });
    if (!student) {
      const error = new Error('Invalid phone number or password');
      error.status = 204;
      throw error;
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, student.password, (err, isMatch) => {
        if (err) reject();
        if (isMatch) resolve(student);
        else {
          const error = new Error('Invalid phone number or password');
          error.status = 204;
          reject(error);
        }
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

const Student = mongoose.model('StudentNew', StudentSchema);

module.exports = {
  Student,
};
