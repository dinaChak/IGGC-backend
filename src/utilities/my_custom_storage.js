// @ts-check
const fs = require('fs');
const sharp = require('sharp');
const crypto = require('crypto');
const path = require('path');


class MyCustomStorage {
  constructor(options) {
    this.options = options;
  }

  _handleFile(req, file, cb) {
    // eslint-disable-next-line
    const filePath = path.join(__dirname, '..', '/uploads/', this.getFilename(file));
    const outStream = fs.createWriteStream(filePath);
    // const resizer = sharp().resize(720, 720, { fit: 'inside'}).jpeg()
    const resizer = sharp().resize(...this.options.images).jpeg();
    file.stream.pipe(resizer).pipe(outStream);
    outStream.on('error', cb);
    outStream.on('finish', () => {
      cb(null, {
        path: filePath,
        size: outStream.bytesWritten,
      });
    });
  }
  // eslint-disable-next-line
  _removeFile(req, file, cb) {
    fs.unlink(file.path, cb);
  }

  // eslint-disable-next-line
  getFilename(file) {
    const bytes = crypto.pseudoRandomBytes(32);

    // create the md5 hash of the random bytes
    const checksum = crypto.createHash('MD5').update(bytes).digest('hex');

    // returns unique filename
    return checksum + Date.now() + path.extname(file.originalname);
  }
}

module.exports = options => new MyCustomStorage(options);
