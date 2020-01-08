const jwt = require('jsonwebtoken');
const { Student } = require('../models/student_new');

const authenticateStudent = async (req, res, next) => {
  try {
    const token = req.header('x-auth');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id);
    if (!student) throw new Error('Invalid token');
    req.student = student;
    next();
  } catch (error) {
    res.status(401).send();
  }
};


const isAuthenticAdminRoleAdmin = (req, res, next) => {
  try {
    const token = req.header('x-auth');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // eslint-disable-next-line
    if (decoded.access !== 'admin') throw new Error('Invalid token');
    // eslint-disable-next-line
    req.user = { _id: decoded._id };
    return next();
  } catch (error) {
    return res.status(401).send();
  }
};


const isAuthenticAdminRoleStaff = (req, res, next) => {
  try {
    const token = req.header('x-auth');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // eslint-disable-next-line
    if (decoded.access !== 'staff') throw new Error('Invalid token');
    // eslint-disable-next-line
    req.user = { _id: decoded._id };
    return next();
  } catch (error) {
    return res.status(401).send();
  }
};

module.exports = { authenticateStudent, isAuthenticAdminRoleAdmin, isAuthenticAdminRoleStaff };
