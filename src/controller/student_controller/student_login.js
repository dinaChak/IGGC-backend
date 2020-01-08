const jwt = require('jsonwebtoken');

const { Student } = require('../../models/student_new');

const studentLogin = async (req, res) => {
  try {
    // eslint-disable-next-line
    const { phone_number, password } = req.body;
    const student = await Student.findByCredentials(phone_number, password);
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
    if (error.status && error.status === 204) {
      res.status(400).send({ error: { msg: error.message, code: error.status } });
    } else res.status(500).send();
  }
};

module.exports = { studentLogin };
