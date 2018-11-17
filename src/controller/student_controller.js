// @ts-check
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const {
  Student,
} = require('../models/student');

const { comparePassword } = require('../utilities/compare_password');

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
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) throw new Error('Invalid email');
    await comparePassword(password, student.password);

    // eslint-disable-next-line
    const token = jwt.sign({ _id: student._id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // eslint-ignore

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


module.exports = {
  registrationController,
  loginController,
};
