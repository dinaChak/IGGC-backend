const _ = require('lodash');

const { IQAC } = require('../../models/iqac');

const createMinute = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['date', 'link']);
    const iqac = await IQAC.findByIdAndUpdate(
      id,
      {
        $push: {
          minutes: body,
        },
      },
      { new: true },
    );
    res.send({ iqac });
  } catch (error) {
    res.status(500).send();
  }
};

const updateMinute = async (req, res) => {
  try {
    const { id, minuteId } = req.params;
    const body = _.pick(req.body, ['date', 'link']);
    const iqac = await IQAC.findOneAndUpdate(
      {
        _id: id,
        'minutes._id': minuteId,
      },
      {
        $set: {
          'minutes.$': body,
        },
      },
      { new: true },
    );
    res.send({ iqac });
  } catch (error) {
    res.status(500).send();
  }
};

const deleteMinute = async (req, res) => {
  try {
    const { id, minuteId } = req.params;
    const iqac = await IQAC.findByIdAndUpdate(
      id,
      {
        $pull: {
          minutes: { _id: minuteId },
        },
      },
      { new: true },
    );
    res.send({ iqac });
  } catch (error) {
    res.status(500).send();
  }
};

const createAqar = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['from', 'to', 'link']);
    const iqac = await IQAC.findByIdAndUpdate(
      id,
      {
        $push: {
          aqar: body,
        },
      },
      { new: true },
    );
    res.send({ iqac });
  } catch (error) {
    res.status(500).send();
  }
};

const updateAqar = async (req, res) => {
  try {
    const { id, aqarId } = req.params;
    const body = _.pick(req.body, ['from', 'to', 'link']);
    const iqac = await IQAC.findOneAndUpdate(
      {
        _id: id,
        'aqar._id': aqarId,
      },
      {
        $set: {
          'aqar.$': body,
        },
      },
      { new: true },
    );
    res.send({ iqac });
  } catch (error) {
    res.status(500).send();
  }
};

const deleteAqar = async (req, res) => {
  try {
    const { id, aqarId } = req.params;
    const iqac = await IQAC.findByIdAndUpdate(
      id,
      {
        $pull: {
          aqar: { _id: aqarId },
        },
      },
      { new: true },
    );
    res.send({ iqac });
  } catch (error) {
    res.status(500).send();
  }
};

const updateIQACComposition = async (req, res) => {
  try {
    const { id } = req.params;
    const { composition = '' } = req.body;
    const iqac = await IQAC.findByIdAndUpdate(
      id,
      {
        $set: { composition },
      },
      { new: true },
    );
    res.send({ iqac });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createMinute,
  updateMinute,
  deleteMinute,
  createAqar,
  updateAqar,
  deleteAqar,
  updateIQACComposition,
};
