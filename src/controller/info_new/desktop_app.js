const path = require('path');
const { readdir } = require('../../utilities/fs-promise');

const getAppName = async (req, res) => {
  try {
    const basePath = path.join(__dirname, '..', '..', '..', 'uploads', 'app', 'win');
    const appList = await readdir(basePath);
    res.send({
      name: appList[appList.length - 1],
    });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = { getAppName };
