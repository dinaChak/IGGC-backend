const fs = require('fs');

const readdir = dirPath => new Promise((resolve, reject) => {
  fs.readdir(dirPath, (err, files) => {
    if (err) reject(err);
    resolve(files);
  });
});

const pathExists = checkPath => new Promise((resolve) => {
  fs.exists(checkPath, exists => resolve(exists));
});

const fileSate = filePath => new Promise((resolve, reject) => fs.stat(filePath, (err, stat) => {
  if (err) reject(err);
  else resolve(stat);
}));

module.exports = {
  readdir,
  pathExists,
  fileSate,
};
