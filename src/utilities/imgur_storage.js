// @ts-check
const sharp = require('sharp');
const path = require('path');
const imgur = require('imgur');
const fs = require('fs');

class MyCustomStorage {
  constructor(options) {
    this.options = options;
  }

  // eslint-disable-next-line class-methods-use-this
  _handleFile(req, file, cb) {
    const outputFilePath = path.join(__dirname, '..', '/uploads/', 'output.png');

    const outStream = fs.createWriteStream(outputFilePath);

    const resizer = sharp().resize(...this.options.images).jpeg();

    file.stream.pipe(resizer).pipe(outStream);
    outStream.on('error', cb);
    outStream.on('finish', () => {
      imgur.uploadFile(outputFilePath)
        .then((json) => {
          cb(null, {
            path: json.data.link,
            size: json.data.size,
            deletehash: json.data.deletehash,
          });
        })
        .catch((error) => {
          console.log(error);
          cb(error);
        });
    });
  }
  // eslint-disable-next-line
  _removeFile(req, file, cb) {
    imgur.deleteImage(file.deletehash)
      .then((status) => {
        console.log(status);
        cb(null);
      })
      .catch((err) => {
        console.error(err.message);
        cb(err.message);
      });
  }
}

module.exports = options => new MyCustomStorage(options);
