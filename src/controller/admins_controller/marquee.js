const _ = require('lodash');
const { Marquee } = require('../../models/marquee');


const createMarquee = async (req, res) => {
  try {
    const body = _.pick(req.body, ['title', 'link']);
    const marquee = new Marquee(body);
    await marquee.save();
    const marquees = await Marquee.find().sort('-posted');
    if (marquees.length > 5) {
      await Marquee.findByIdAndDelete(marquees[marquees.length - 1]._id);
    }
    res.send({ marquee });
  } catch (error) {
    res.status(500).send();
  }
};


const updateMarquee = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['title', 'link']);
    const marquee = await Marquee.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );

    res.send({ marquee });
  } catch (error) {
    res.status(500).send();
  }
};


const deleteMarquee = async (req, res) => {
  try {
    const { id } = req.params;
    const marquee = await Marquee.findByIdAndDelete(id);
    res.send({ marquee });
  } catch (error) {
    res.status(500).send();
  }
};


module.exports = {
  createMarquee,
  updateMarquee,
  deleteMarquee,
};
