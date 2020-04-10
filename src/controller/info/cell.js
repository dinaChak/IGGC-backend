const { Cell } = require('../../models/cell');

const getCells = async (req, res) => {
  try {
    const { select } = req.query;
    const query = [{}];
    if (select) (query.push(select));
    const cells = await Cell.find(...query).sort('position');
    res.send({ cells });
  } catch (error) {
    res.status(500).send();
  }
};

const getCell = async (req, res) => {
  try {
    const { id } = req.params;
    const cell = await Cell.findById(id);
    res.send({ cell });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  getCells,
  getCell,
};
