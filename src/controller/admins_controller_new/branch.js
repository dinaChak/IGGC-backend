const { Branch } = require('../../models/branch');

const createBranch = async (req, res) => {
  try {
    const { title } = req.body;
    const branch = new Branch({ title });
    await branch.save();
    res.send({ branch });
  } catch (error) {
    res.status(500).send();
  }
};

const updateBranch = async (req, res) => {
  try {
    const { title } = req.body;
    const { id } = req.params;
    const branch = await Branch.findByIdAndUpdate(id, { $set: { title } }, { new: true });
    if (!branch) return res.status(422).send({ errors: [{ msg: 'invalid branch' }] });
    return res.send({ branch });
  } catch (error) {
    return res.status(500).send();
  }
};

const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findByIdAndDelete(id);
    res.send(branch);
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createBranch,
  updateBranch,
  deleteBranch,
};
