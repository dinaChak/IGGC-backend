// @ts-check
const bcrypt = require('bcryptjs');

const comparePassword = (password, savedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, savedPassword, (err, res) => {
      if (res) {
        resolve();
      } else {
        reject(new Error("Invalid password"));
      }
    });
  });
}

module.exports = {
  comparePassword
};