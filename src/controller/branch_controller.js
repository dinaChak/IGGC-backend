// @ts-check
const {
  Branch,
} = require('../models/branch');

// get available branches
const getBranchesController = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.send({
      branches,
    });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = { getBranchesController };
