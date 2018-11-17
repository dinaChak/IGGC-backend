const { Branch } = require('../models/branch');

const createBranchController = async (req, res) => {
  const { title } = req.body;

  try {
    const branch = new Branch({ title });
    await branch.save();
    res.json({
      message: 'success'
    });
  } catch (error) {
    res.status(500).send();
  }
}


module.exports = { createBranchController };