const { Branch } = require('../../models/branch');

const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.send({ branches });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  getBranches,
};
