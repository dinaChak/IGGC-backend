const { Bulletin } = require('../../models/bulletin');


const getBulletins = async (req, res) => {
  try {
    const {
      type,
      limit = 10,
      page = 0,
    } = req.query;
    const query = {};

    if (type) (query.type = type);
    const response = await Promise.all([
      Bulletin.find(query)
        .sort('-date')
        .limit(Number(limit))
        .skip(Number(limit) * Number(page)),
      Bulletin.countDocuments(query),
    ]);
    res.send({
      bulletins: response[0],
      totalCount: response[1],
    });
  } catch (error) {
    res.status(500).send();
  }
};

const getBulletin = async (req, res) => {
  try {
    const { id } = req.params;
    const bulletin = await Bulletin.findById(id);
    if (!bulletin) return res.status(404).send({ error: 'Bulletin not found' });
    return res.send({ bulletin });
  } catch (error) {
    return res.status(500).send();
  }
};

module.exports = { getBulletins, getBulletin };
