const _ = require('lodash');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const axios = require('axios');


const { Student } = require('../models/student');
const { StudentInstance } = require('../models/studentInstance');
const { Semester } = require('../models/semester');
const { Session } = require('../models/session');
const { Admission } = require('../models/admission');

const myCustomStorage = require('../utilities/imgur_storage');
const { comparePassword } = require('../utilities/compare_password');

// student registration
const registrationController = async (req, res) => {
  const studentBody = _.pick(req.body, ['phoneNumber', 'password', 'branch']);
  try {
    const student = new Student(studentBody);
    const studentInstance = new StudentInstance({
    // eslint-disable-next-line
      student: student._id,
    });
    await student.save();
    await studentInstance.save();
    // eslint-disable-next-line
     const token = jwt.sign({ _id: student._id, access: 'student', }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.header('x-auth', token).send({
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
    const student = await Student.findOne({ phoneNumber }).populate('branch');
    if (!student) {
      const error = new Error('Invalid email');
      error.status = 422;
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
    // eslint-disable-next-line
    const studentInstance = await StudentInstance.findOne({ student: student._id }).populate('semester');
    return res.header('x-auth', token).send({ student, studentInstance });
  } catch (error) {
    console.error(error);
    if (error.status) {
      return res.status(error.status).send({
        errors: [{
          msg: 'Invalid phone number or password',
        }],
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
    res.send({ student });
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
      const student = await Student.findOneAndUpdate(
        // eslint-disable-next-line
        { _id: req.user._id },
        { $set: { profileImage: req.file.path } },
        {
          new: true,
        },
      ).populate('branch');
      return res.send({ student });
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
      const student = await Student.findOneAndUpdate(
        // eslint-disable-next-line
        { _id: req.user._id },
        { $set: { signatureImage: req.file.path } },
        { new: true },
      ).populate('branch');
      return res.send({ student });
    } catch (error) {
      console.log('afsfasfaagaga', error);
      return res.status(500).send();
    }
  });
};

// new semester admission
const newSemesterAdmission = async (req, res) => {
  try {
    // eslint-disable-next-line
    const studentId = req.user._id;
    const { semester: semesterNo } = req.body;
    const session = (await Session.find().sort('from').limit(1))[0];
    if (!session) throw new Error('No Session found');

    let semester;
    // eslint-disable-next-line
    semester = await Semester.findOne({ number: semesterNo, session: session._id, student: studentId });

    if (!semester) {
      const student = await Student.findById(studentId);
      // eslint-disable-next-line
      semester = new Semester({ branch: student.branch, number: semesterNo, student: studentId, session: session._id });
      await semester.save();
    }

    const studentInstance = await StudentInstance.findOneAndUpdate(
      {
        student: studentId,
      },
      {
        $set: {
          // eslint-disable-next-line
          semester: semester._id,
        },
      },
      {
        new: true,
      },
    );
    return res.send({
      studentInstance,
      semester,
    });
  } catch (error) {
    console.error('dfafafasf', error);
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
      ).populate('semester');
      if (!studentInstance) throw new Error('studentInstance not found');
      return res.send({ studentInstance });
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  });
};

// capture payment
const capturePayment = async (req, res) => {
  try {
    // eslint-disable-next-line
    const { razorpay_payment_id } = req.params;
    // eslint-disable-next-line
    const student = await Student.findById(req.user._id);
    if (!student) throw new Error('No StudentInstance found');
    const admission = (await Admission.find())[0];
    if (!admission) throw new Error('No StudentInstance found');
    // eslint-disable-next-line
    const fees = admission.openFor.find(x => x.branch.toHexString() === student.branch.toHexString()).fee;
    const response = await axios.post(
    // eslint-disable-next-line
      `https://${process.env.RAZORPAY_KEY}:${process.env.RAZORPAY_SECRET}@api.razorpay.com/v1/payments/${razorpay_payment_id}/capture`,
      {
        amount: String(Number(fees) * 100),
      },
    );
    console.log(response.data);
    res.send();
  } catch (error) {
    console.log(error);
    res.send();
  }
};


module.exports = {
  registrationController,
  loginController,
  updateBasicInfoController,
  uploadProfileImage,
  uploadStudentSignature,
  newSemesterAdmission,
  uploadVerificationDocument,
  capturePayment,
};
