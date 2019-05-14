const jwt = require('jsonwebtoken');
const _ = require('lodash');

const { Student } = require('../../models/student');
const { StudentInstance } = require('../../models/studentInstance');

const { comparePassword } = require('../../utilities/compare_password');

// registration
const registration = async (req, res) => {
  try {
    const body = _.pick(req.body, ['name', 'phoneNumber', 'password', 'dateOfBirth', 'branch']);
    const student = new Student(body);
    const studentInstance = new StudentInstance({
      // eslint-disable-next-line
      student: student._id, 
      name: body.name,
      branch: body.branch,
    });
    await Promise.all([student.save(), studentInstance.save()]);
    const token = jwt.sign({
      // eslint-disable-next-line
      _id: student._id,
      branch: student.branch,
      access: 'student',
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    });
    res.header('x-auth', token).send({
      student,
      studentInstance,
    });
  } catch (error) {
    res.status(500).send();
  }
};

const login = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const student = await Student.findOne({ phoneNumber });
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
    const token = jwt.sign({ _id: student._id, branch: student.branch, access: 'student', }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    // eslint-disable-next-line
    const studentInstance = await StudentInstance.findOne({ student: student._id }).populate('semester');
    return res.header('x-auth', token).send({ student, studentInstance });
  } catch (error) {
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
const updateStudentInfo = async (req, res) => {
  try {
    const formatedStudent = {
      email: req.body.email,
      fatherName: req.body.fatherName,
      motherName: req.body.motherName,
      gender: req.body.gender,
      religion: req.body.religion,
      category: req.body.category,
      nationality: req.body.nationality,
      address: {
        present: req.body.presentAddress,
        permanent: req.body.permanentAddress,
      },
    };
    // eslint-disable-next-line
    const student = await Student.findByIdAndUpdate(req.user._id, { $set: formatedStudent }, { new: true });
    if (!student) throw new Error('Invalid student id');

    res.send({ student });
  } catch (error) {
    res.status(500).send();
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const body = _.pick(
      req.body,
      [
        'phoneNumber',
        'email',
        'fatherName',
        'motherName',
        'gender',
        'dateOfBirth',
        'phoneNumber',
        'category',
        'nationality',
        'religion',
      ],
    );
    const { presentAddress, permanentAddress } = req.body;
    if (!!presentAddress || !!permanentAddress) {
      body.address = {};
      if (presentAddress) body.address = { ...body.address, present: presentAddress };
      if (permanentAddress) body.address = { ...body.address, permanent: permanentAddress };
    }
    // eslint-disable-next-line
    const student = await Student.findByIdAndUpdate(req.user._id, { $set: body }, { new: true });
    res.send({ student });
  } catch (error) {
    res.status(500).send();
  }
};

const updateStudentName = async (req, res) => {
  try {
    const { name } = req.body;
    const response = await Promise.all([
      // eslint-disable-next-line
      Student.findByIdAndUpdate(req.user._id, { $set: { name } }, { new: true }),
      // eslint-disable-next-line
      StudentInstance.findOneAndUpdate({ student: req.user._id }, { $set: { name } }, { new: true })
        .populate('student')
        .populate('semester'),
    ]);
    res.send({
      student: response[0],
      studentInstance: response[1],
    });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  registration,
  login,
  updateStudentInfo,
  updateStudentProfile,
  updateStudentName,
};
