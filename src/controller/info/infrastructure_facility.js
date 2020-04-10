const { InfrastructureFacility } = require('../../models/infrastructure_facility');

const getInfrastructureFacilities = async (req, res) => {
  try {
    const { select } = req.query;
    const query = [{}];
    if (select) query.push(select);
    const infrastructureFacilities = await InfrastructureFacility.find(...query).sort('position');
    res.send({ infrastructureFacilities });
  } catch (error) {
    res.status(500).send();
  }
};

const getInfrastructureFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const infrastructureFacility = await InfrastructureFacility.findById(id);
    res.send({ infrastructureFacility });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  getInfrastructureFacilities,
  getInfrastructureFacility,
};
