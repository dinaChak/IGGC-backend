const { Branch } = require('../models/branch');

const createBranch = async (req, res) => {
  const { title } = req.body;

  try {
    const branch = new Branch({ title });
    await branch.save();
    res.json({
      message: 'success'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
}


module.exports = { createBranch };