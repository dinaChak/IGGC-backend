// @ts-check
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const myCustomStorage = require('../utilities/my_custome_storage');

const {
  Student,
} = require('../models/student');

const {
  comparePassword,
} = require('../utilities/compare_password');

// student registration
const registrationController = async (req, res) => {
  const body = _.pick(req.body, ['email', 'password', 'name', 'dateOfBirth', 'gender', 'branch', 'phoneNumber']);
  try {
    const student = new Student(body);
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


module.exports = {
  registrationController,
  loginController,
  changeProfileImage,
};
