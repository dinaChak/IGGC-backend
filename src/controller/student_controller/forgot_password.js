const _ = require('lodash');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const { Student } = require('../../models/student_new');


const hastPassword = password => new Promise((resolve, reject) => {
  bcrypt.genSalt(12, (err, salt) => {
    // eslint-disable-next-line
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
});


const forgotPassword = async (req, res) => {
  try {
    const body = _.pick(req.body, ['name', 'date_of_birth', 'phone_number']);
    const student = await Student.findOne(body);
    if (student) {
      const token = jwt.sign({
        // eslint-disable-next-line
        id: student._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      });
      res.header('x-token', token).send({ student });
    } else {
      res.status(422).send({ error: 'Invalid "Name", "Date Of Birth" or "Mobile Number"' });
    }
  } catch (error) {
    res.status(500).send();
  }
};

const changePassword = async (req, res) => {
  try {
    const token = req.header('x-token');
    if (!token) {
      res.status(400).send({ error: 'Please Provide token' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let student = await Student.findById(decoded.id);
    if (!student) {
      res.status(401).send({ error: 'Invalid token' });
    }
    const { password } = req.body;
    const hash = await hastPassword(password);
    student = await Student.findByIdAndUpdate(decoded.id, { password: hash }, { new: true });
    res.send({ student });
  } catch (error) {
    if (error.name && error.name === 'JsonWebTokenError') {
      res.status(400).send({ error: error.message });
    }
    res.status(500).send();
  }
};


module.exports = {
  forgotPassword,
  changePassword,
};
