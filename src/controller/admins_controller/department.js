const _ = require('lodash');

const { Department } = require('../../models/department');

const createDepartment = async (req, res) => {
  try {
    const body = _.pick(req.body, ['title', 'description', 'stream']);
    const department = new Department(body);
    await department.save();
    res.send({ department });
  } catch (error) {
    res.status(500).send();
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['title', 'description', 'stream']);
    const department = await Department.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );
    res.send({ department });
  } catch (error) {
    res.status(500).send();
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndDelete(id);
    res.send({ department });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
