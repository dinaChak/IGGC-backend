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


// get admission info
const getAdmissionController = async (req, res) => {
  try {
    const admission = await Admission.find();
    res.send(admission[0]);
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = { getBranchesController, getAdmissionController };
