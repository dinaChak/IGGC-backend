const _ = require('lodash');
const {  validationResult } = require('express-validator/check');

const {
  Student
} = require('../models/student');
const {
  Branch
} = require('../models/branch');


const registrationController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(422).send({ errors: errors.array() });

  const body = _.pick(req.body, ['email', 'password', 'name', 'dateOfBirth', 'gender', 'branch', 'phoneNumber']);
  try {
    const student = new Student(body);
    await student.save();
    res.send();
  } catch (error) {
    console.error(error);
    res.status(500).send()
  }
};


const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.send({
      branches
    });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
}


module.exports = {
  registrationController,
  getBranches
}