const _ = require('lodash');
const jwt = require('jsonwebtoken');

const { Admin } = require('../../models/admin');
const { comparePassword } = require('../../utilities/compare_password');

const registration = async (req, res) => {
  try {
    const body = _.pick(req.body, ['name', 'password', 'role']);
    const admin = new Admin(body);
    await admin.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

const login = async (req, res) => {
  const { name, password } = req.body;
  try {
    const admin = await Admin.findOne({ name });
    if (!admin) return res.status(422).send({ errors: [{ msg: 'Invalid password or name' }] });
    const isPasswordCorrect = await comparePassword(password, admin.password);
    if (!isPasswordCorrect) return res.status(422).send({ errors: [{ msg: 'Invalid password or name' }] });

    // eslint-disable-next-line
    const token = jwt.sign({ _id: admin._id, access: admin.role }, process.env.JWT_SECRET, { expiresIn: '7h' });
    return res.header('x-auth', token).send(admin);
  } catch (error) {
    return res.status(500).send();
  }
};

module.exports = {
  registration,
  login,
};
