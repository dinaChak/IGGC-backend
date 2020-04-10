// const fs = require('fs');
// const mime = require('mime');
const path = require('path');
// const { readdir, fileSate } = require('../../utilities/fs-promise');
const { readdir } = require('../../utilities/fs-promise');

const downloadDesktopAppLatest = async (req, res) => {
  try {
    const basePath = path.join(__dirname, '..', '..', '..', 'uploads', 'app', 'win');
    const appNames = await readdir(basePath);
    const appPath = path.join(basePath, appNames[appNames.length - 1]);
    // const stat = await fileSate(appPath);
    // const mimeType = mime.getType(appPath);
    // res.setHeader('content-type', mimeType);
    // const reader = fs.createReadStream(appPath);
    // reader.pipe(res);
    res.download(appPath);
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = { downloadDesktopAppLatest };
