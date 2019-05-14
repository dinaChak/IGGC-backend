const jwt = require('jsonwebtoken');

const isAuthenticStudent = (req, res, next) => {
  try {
    const token = req.header('x-auth');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // eslint-disable-next-line
    if (decoded.access !== 'student') throw new Error('Invalid token');
    // eslint-disable-next-line
    req.user = { _id: decoded._id, branch: decoded.branch };
    return next();
  } catch (error) {
    return res.status(401).send();
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

module.exports = { isAuthenticStudent, isAuthenticAdminRoleAdmin, isAuthenticAdminRoleStaff };
