// @ts-check
const { Branch } = require('../models/branch');
const { Admission } = require('../models/admission');

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


// get admission
const getAdmission = async (req, res) => {
  try {
    const admission = (await Admission.find()
      .limit(1)
      .sort('-update')
      .populate('session')
      .populate({
        path: 'openFor.branch',
        model: 'Branch',
      }))[0];

    res.send({ admission });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

module.exports = { getBranchesController, getAdmission };
