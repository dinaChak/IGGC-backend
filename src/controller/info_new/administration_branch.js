const { AdministrationBranch } = require('../../models/administration_branch');

const getAdministrationBranches = async (req, res) => {
  try {
    const administrationBranches = await AdministrationBranch.find({});
    res.send({ administrationBranches });
  } catch (error) {
    res.status(500).send();
  }
};

const getAdministrationBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const administrationBranch = await AdministrationBranch.findById(id);
    res.send({ administrationBranch });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  getAdministrationBranches,
  getAdministrationBranch,
};
