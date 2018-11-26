// @ts-check
const bcrypt = require('bcryptjs');

const comparePassword = (password, savedPassword) => new Promise((resolve) => {
  bcrypt.compare(password, savedPassword, (err, res) => {
    if (res) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
});

module.exports = {
  comparePassword,
};
