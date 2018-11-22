const _ = require('lodash');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const myCustomStorage = require('../utilities/my_custome_storage');
const { admissionOpen } = require('../utilities/admission_open');

const {
  Student,
} = require('../models/student');
const { Semester } = require('../models/semester');

const {
  comparePassword,
} = require('../utilities/compare_password');

// student registration
const registrationController = async (req, res) => {
  const studentBody = _.pick(req.body, ['email', 'password', 'name']);
  try {
    const student = new Student(studentBody);
    // eslint-disable-next-line
    await student.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};


// student login
const loginController = async (req, res) => {
  const {
    email,
    password,
  } = req.body;
  try {
    const student = await Student.findOne({
      email,
    });
    if (!student) throw new Error('Invalid email');
    await comparePassword(password, student.password);

    // eslint-disable-next-line
    const token = jwt.sign({ _id: student._id, access: 'student', }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    }); // eslint-ignore

    return res.header('x-auth', token).send(student);
  } catch (error) {
    if (error.message.includes('Invalid')) {
      return res.status(401).send({
        errors: [{
          msg: 'Invalid email or password',
        }],
      });
    }
  }
  return res.status(500).send();
};


// change student profile image
const profileImageStorage = myCustomStorage({
  images: [
    480,
    480,
    'inside',
  ],
});

const profileImageUpload = multer({
  storage: profileImageStorage,
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'), false);
    }
    return callback(null, true);
  },
}).single('profileimage');

const changeProfileImage = (req, res) => {
  profileImageUpload(req, res, async (err) => {
    if (err) {
      return res.status(422).send({ errors: [{ msg: err.message }] });
    }

    try {
      await Student.findOneAndUpdate(
        // eslint-disable-next-line
        { _id: req.user._id },
        { $set: { profileImage: req.file.path } },
      );
      return res.send({ message: 'successfully changed profile image' });
    } catch (error) {
      return res.status(500).send();
    }
  });
};

// change signature
const signatureImageStorage = myCustomStorage({
  images: [
    280,
    280,
    'inside',
  ],
});

const signatureImageUpload = multer({
  storage: signatureImageStorage,
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'), false);
    }
    return callback(null, true);
  },
}).single('signature');

const changeSignatureImage = (req, res) => {
  signatureImageUpload(req, res, async (err) => {
    if (err) {
      return res.status(422).send({ errors: [{ msg: err.message }] });
    }

    try {
      await Student.findOneAndUpdate(
        // eslint-disable-next-line
        { _id: req.user._id },
        { $set: { profileImage: req.file.path } },
      );
      return res.send({ message: 'successfully changed signature image' });
    } catch (error) {
      return res.status(500).send();
    }
  });
};

// application submission
/**
 *
 * @param {*} req req.body contains
 * [
 *  'fatherName',
    'motherName',
    'dateOfBirth',
    'address',
    'branch',
  ]
 * @param {*} res
 */
const updateStudentDetailsController = async (req, res) => {
  const formatedStudent = {
    name: req.body.name,
    email: req.body.email,
    fatherName: req.body.fatherName,
    motherName: req.body.motherName,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender,
    phoneNumber: req.body.phoneNumber,
    religion: req.body.religion,
    category: req.body.category,
    nationality: req.body.nationality,
    address: {
      present: req.body.presentAddress,
      permanent: req.body.permanentAddress,
    },

  };


  try {
    const student = await Student.findByIdAndUpdate(
      // eslint-disable-next-line
      req.user._id, {
        $set: formatedStudent,
      },
      {
        new: true,
      },
    );
    if (!student) throw new Error('Invalid student id');
    res.send(student);
  } catch (error) {
    res.status(500).send();
  }
};

// semester admission
const semesterAdmissionController = async (req, res) => {
  try {
    const isAdmissionOpen = await admissionOpen();
    if (!isAdmissionOpen) throw new Error('Admission closed');
    const semester = new Semester({
      number: req.body.semester,
      // eslint-disable-next-line
      student: req.user._id,
    });
    await semester.save();
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

// new admission
const newAdmissionController = async (req, res) => {
  try {
    const isAdmissionOpen = await admissionOpen();
    if (!isAdmissionOpen) throw new Error('Admission closed');
    const semester = new Semester({
      number: req.body.semester,
      // eslint-disable-next-line
      student: req.user._id,
    });
    await semester.save();
    // eslint-disable-next-line
    const student = await Student.findByIdAndUpdate(req.user._id, {
      $set: {
        branch: req.body.branch,
      },
    }, {
      new: true,
    });
    res.send({
      semester,
      student,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};

// upload verification document
const verificationDocument = myCustomStorage({
  images: [
    720,
    720,
    'inside',
  ],
});

const verificationDocumentUpload = multer({
  storage: verificationDocument,
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'), false);
    }
    return callback(null, true);
  },
}).single('verificationDocument');

// eslint-disable-next-line
const submitVerificationDocument = (req, res) => {
  verificationDocumentUpload(req, res, async (err) => {
    if (err) return res.status(422).send({ errors: [{ msg: err.message }] });
    try {
      const semester = await Semester.findOneAndUpdate(
        {
          _id: req.params.id,
          // eslint-disable-next-line
          student: req.user._id,
        },
        {
          $set: {
            verification: {
              status: 'unverified',
              documentImage: req.file.path,
            },
          },
        },
        {
          new: true,
        },
      );
      if (!semester) throw new Error('Invalid id');
      return res.send();
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  });
};


module.exports = {
  registrationController,
  loginController,
  changeProfileImage,
  changeSignatureImage,
  updateStudentDetailsController,
  newAdmissionController,
  semesterAdmissionController,
  submitVerificationDocument,
};
