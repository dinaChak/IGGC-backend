const _ = require('lodash');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');


const { Student } = require('../models/student');
const { StudentInstance } = require('../models/studentInstance');
const { Semester } = require('../models/semester');
const { Session } = require('../models/session');

const myCustomStorage = require('../utilities/my_custom_storage');
const { comparePassword } = require('../utilities/compare_password');

// student registration
const registrationController = async (req, res) => {
  const studentBody = _.pick(req.body, ['phoneNumber', 'password', 'name']);
  try {
    const student = new Student(studentBody);
    const studentInstance = new StudentInstance({
    // eslint-disable-next-line
      student: student._id,
    });
    await student.save();
    await studentInstance.save();
    res.send({
      student,
      studentInstance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

// student login
const loginController = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const student = await Student.findOne({ phoneNumber });
    if (!student) {
      const error = new Error('Invalid email');
      error.status = 400;
      throw error;
    }
    const isPasswordCorrect = await comparePassword(password, student.password);
    if (!isPasswordCorrect) {
      const error = new Error('Invalid password');
      error.status = 422;
      throw error;
    }
    // eslint-disable-next-line
    const token = jwt.sign({ _id: student._id, access: 'student', }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    return res.header('x-auth', token).send(student);
  } catch (error) {
    console.error(error);
    if (error.status) {
      return res.status(error.status).send({
        error: {
          msg: 'Invalid phone number or password',
        },
      });
    }
    return res.status(500).send();
  }
};

// update student basic info
const updateBasicInfoController = async (req, res) => {
  const formatedStudent = {
    name: req.body.name,
    email: req.body.email,
    fatherName: req.body.fatherName,
    motherName: req.body.motherName,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender,
    religion: req.body.religion,
    category: req.body.category,
    nationality: req.body.nationality,
    address: {
      present: req.body.presentAddress,
      permanent: req.body.permanentAddress,
    },
  };
  try {
    // eslint-disable-next-line
    const student = await Student.findByIdAndUpdate(req.user._id, { $set: formatedStudent }, { new: true });
    if (!student) throw new Error('Invalid student id');
    res.send(student);
  } catch (error) {
    res.status(500).send();
  }
};

// upload student image
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
}).single('profileImage');

const uploadProfileImage = (req, res) => {
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


// upload student signature
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

const uploadStudentSignature = (req, res) => {
  signatureImageUpload(req, res, async (err) => {
    if (err) {
      return res.status(422).send({ errors: [{ msg: err.message }] });
    }

    try {
      await Student.findOneAndUpdate(
        // eslint-disable-next-line
        { _id: req.user._id },
        { $set: { signatureImage: req.file.path } },
      );
      return res.send({ message: 'successfully changed signature image' });
    } catch (error) {
      return res.status(500).send();
    }
  });
};

// new semester admission
const newSemesterAdmission = async (req, res) => {
  try {
    // eslint-disable-next-line
    const studentId = req.user._id;
    const { semester, branch } = req.body;
    const session = (await Session.find().sort('from').limit(1))[0];
    if (!session) throw new Error('No Session found');
    // eslint-disable-next-line
    const newSemester = new Semester({ branch, number: semester, student: studentId, session: session._id });
    const promiseArr = await Promise.all([
      newSemester.save(),
      StudentInstance.findOneAndUpdate(
        {
          student: studentId,
        },
        {
          $set: {
            // eslint-disable-next-line
            semester: newSemester._id,
          },
        },
        {
          new: true,
        },
      ),
      Student.findByIdAndUpdate(
        studentId,
        {
          $set: {
            branch,
          },
        },
        {
          new: true,
        },
      ),
    ]);
    return res.send({
      semester: promiseArr[0],
      studentInstance: promiseArr[1],
      student: promiseArr[2],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
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

const uploadVerificationDocument = (req, res) => {
  verificationDocumentUpload(req, res, async (err) => {
    if (err) return res.status(422).send({ errors: [{ msg: err.message }] });
    try {
      const studentInstance = await StudentInstance.findOneAndUpdate(
        {
          // eslint-disable-next-line
          student: req.user._id,
        },
        {
          $set: {
            documentImage: req.file.path,
          },
        },
        {
          new: true,
        },
      );
      if (!studentInstance) throw new Error('studentInstance not found');
      return res.send(studentInstance);
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  });
};


module.exports = {
  registrationController,
  loginController,
  updateBasicInfoController,
  uploadProfileImage,
  uploadStudentSignature,
  newSemesterAdmission,
  uploadVerificationDocument,
};
