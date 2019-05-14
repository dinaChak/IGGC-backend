const { Principal } = require('../../models/principal');


const getPrincipal = async (req, res) => {
  try {
    const principal = await Principal.findOne();
    res.send({ principal });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = { getPrincipal };
