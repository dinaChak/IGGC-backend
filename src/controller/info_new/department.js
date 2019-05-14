const _ = require('lodash');

const { Department } = require('../../models/department');

const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    res.send({ department });
  } catch (error) {
    res.status(500).send();
  }
};

const getDepartments = async (req, res) => {
  try {
    const { select, populate } = req.query;
    const queryBody = _.pick(req.query, ['stream']);
    const query = [queryBody];
    if (select) {
      query.push(select);
    }
    let departments;
    if (populate) {
      departments = await Department
        .find(...query)
        .populate(...populate.split(','));
    } else {
      departments = await Department.find(...query);
    }
    res.send({ departments });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  getDepartment,
  getDepartments,
};
