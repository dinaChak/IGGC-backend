const { Marquee } = require('../../models/marquee');

const getMarquees = async (req, res) => {
  try {
    const marquees = await Marquee
      .find()
      .sort('-posted')
      .limit(5);
    res.send({ marquees });
  } catch (error) {
    res.status(500).send();
  }
};


module.exports = { getMarquees };
