// @ts-check
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const { Admin } = require('../models/admin');
const { Branch } = require('../models/branch');
const { Admission } = require('../models/admission');
const { comparePassword } = require('../utilities/compare_password');

// creates new branch
const createBranchController = async (req, res) => {
  const { title } = req.body;

  try {
    const branch = new Branch({ title });
    await branch.save();
    res.json({
      message: 'success',
    });
  } catch (error) {
    res.status(500).send();
  }
};

// registers new admin
const registrationController = async (req, res) => {
  const body = _.pick(req.body, ['name', 'password', 'role']);
  try {
    const newAdmin = new Admin(body);
    await newAdmin.save();
    return res.send();
  } catch (error) {
    return res.status(500).send();
  }
};

// admin login
const loginController = async (req, res) => {
  const { name, password } = req.body;
  try {
    const admin = await Admin.findOne({ name });
    if (!admin) throw new Error('Invalid name');
    await comparePassword(password, admin.password);

    // eslint-disable-next-line
    const token = jwt.sign({ _id: admin._id, access: admin.role }, process.env.JWT_SECRET, { expiresIn: '7h' });
    return res.header('x-auth', token).send(admin);
  } catch (error) {
    if (error.message.includes('Invalid')) {
      return res.status(401).send({
        errors: [{
          msg: 'Invalid name or password',
        }],
      });
    }
    return res.status(500).send();
  }
};

// create new admission
const createAdmission = async (req, res) => {
  const body = _.pick(req.body, ['openingDate', 'closingDate', 'semester']);
  try {
    const admission = await Admission.find();
    if (admission.length === 0) {
      const newAdmission = new Admission(body);
      await newAdmission.save();
      res.send(newAdmission);
    } else {
      const updatedAdmission = await Admission.findByIdAndUpdate(
        // eslint-disable-next-line
        admission[0]._id,
        { $set: body },
        { new: true },
      );
      res.send(updatedAdmission);
    }
  } catch (error) {
    res.status(500).send();
  }
};


module.exports = {
  registrationController, loginController, createBranchController, createAdmission,
};
