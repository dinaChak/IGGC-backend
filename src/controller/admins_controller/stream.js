const _ = require('lodash');

const { Stream } = require('../../models/stream');

const createStream = async (req, res) => {
  try {
    const body = _.pick(req.body, ['title', 'description']);
    const stream = new Stream(body);
    await stream.save();
    res.send({ stream });
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

const updateStream = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['title', 'description']);
    const stream = await Stream.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );
    res.send({ stream });
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

const deleteStream = async (req, res) => {
  try {
    const { id } = req.params;
    const stream = await Stream.findByIdAndDelete(id);
    res.send({ stream });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createStream,
  updateStream,
  deleteStream,
};
