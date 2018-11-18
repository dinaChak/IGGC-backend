const jwt = require('jsonwebtoken');

const isAuthenticStudent = (req, res, next) => {
  try {
    const token = req.header('x-auth');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // eslint-disable-next-line
    if (decoded.access !== 'student') throw new Error('Invalid token');
    // eslint-disable-next-line
    req.user = { _id: decoded._id };
    return next();
  } catch (error) {
    return res.status(401).send();
  }
};

module.exports = { isAuthenticStudent };
