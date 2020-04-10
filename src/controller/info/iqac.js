const { IQAC } = require('../../models/iqac');

const getIqac = async (req, res) => {
  try {
    const iqac = await IQAC.findOne({});
    res.send({ iqac });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  getIqac,
};
