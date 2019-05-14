const _ = require('lodash');

const { Cell } = require('../../models/cell');

const createCell = async (req, res) => {
  try {
    const body = _.pick(req.body, ['title', 'subtitle', 'body', 'position']);
    const cell = new Cell(body);
    await cell.save();
    res.send({ cell });
  } catch (error) {
    if (error.name && error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        ...error.errors[key].properties,
        msg: error.errors[key].properties.message,
        param: error.errors[key].properties.path,
        location: 'body',
      }));
      res.status(422).send({ errors });
    } else {
      res.status(500).send();
    }
  }
};

const updateCell = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['title', 'subtitle', 'body', 'position']);
    const cell = await Cell.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );
    res.send({ cell });
  } catch (error) {
    if (error.name && error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).map(key => ({
        ...error.errors[key].properties,
        msg: error.errors[key].properties.message,
        param: error.errors[key].properties.path,
        location: 'body',
      }));
      res.status(422).send({ errors });
    } else {
      res.status(500).send();
    }
  }
};

const deleteCell = async (req, res) => {
  try {
    const { id } = req.params;
    const cell = await Cell.findByIdAndDelete(id);
    res.send({ cell });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createCell,
  updateCell,
  deleteCell,
};
