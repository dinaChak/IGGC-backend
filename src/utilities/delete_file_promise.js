const fs = require('fs');

module.exports = filePath => new Promise((resolve, reject) => {
  fs.unlink(filePath, (err) => {
    if (err) reject(err);
    resolve();
  });
});
