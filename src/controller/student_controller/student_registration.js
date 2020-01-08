const _ = require('lodash');
const jwt = require('jsonwebtoken');

const { Student } = require('../../models/student_new');

const registerStudent = async (req, res) => {
  try {
    const body = _.pick(req.body, ['name', 'password', 'date_of_birth', 'gender', 'phone_number', 'email']);
    const student = new Student(body);
    await student.save();

    const token = jwt.sign({
      // eslint-disable-next-line
      id: student._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    });
    res.header('x-auth', token).send({ student });
  } catch (error) {
    res.status(500).send();
  }
};


module.exports = { registerStudent };
