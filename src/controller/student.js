const _ = require('lodash');

const { Student } = require('../models/student');


const registration = (req, res) => {
  const body = _.pick(req.body, ['email', 'password', 'name', 'dataOfBirth', 'gender', 'branch', 'phoneNumber']);
  res.send(body);
};


module.exports = {
  registration
}