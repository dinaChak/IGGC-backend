const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

class MyCustomStorage {
  constructor({ basePath, baseDir }) {
    this.basePath = basePath;
    this.baseDir = baseDir;
  }

  _handleFile(req, file, cb) {
    // eslint-disable-next-line
    const fileName = this._getFilename(file);
    const filePath = path.join(this.basePath, this.baseDir, fileName);
    const outputStream = fs.createWriteStream(filePath);
    file.stream.pipe(outputStream);
    outputStream.on('error', cb);
    outputStream.on('finish', () => {
      cb(null, {
        fileName,
        originalFileName: file.originalname,
        path: filePath,
        baseDir: this.baseDir,
        link: `http://${req.headers.host}/public/${this.baseDir}/${fileName}`,
        size: outputStream.bytesWritten,
        fileType: path.extname(fileName).toLowerCase().split('.')[1],
      });
    });
  }

  // eslint-disable-next-line
  _removeFile(req, file, cb) {
    fs.unlink(file.path, cb);
  }

  // eslint-disable-next-line
  _getFilename(file) {
    const bytes = crypto.pseudoRandomBytes(32);

    // create the md5 hash of the random bytes
    const checksum = crypto.createHash('MD5').update(bytes).digest('hex');

    // returns unique filename
    return checksum + Date.now() + path.extname(file.originalname);
  }
}

module.exports = options => new MyCustomStorage(options);
