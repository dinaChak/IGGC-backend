const { Stream } = require('../../models/stream');

const getStreams = async (req, res) => {
  try {
    const { select } = req.query;
    const query = [{}];
    if (select) {
      query.push(select);
    }
    const streams = await Stream.find(...query).sort('title');
    res.send({ streams });
  } catch (error) {
    res.status(500).send();
  }
};

const getStream = async (req, res) => {
  try {
    const { id } = req.params;
    const stream = await Stream.findById(id);
    res.send({ stream });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  getStreams,
  getStream,
};
