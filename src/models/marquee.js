const mongoose = require('mongoose');

const MarqueeSchema = new mongoose.Schema({
  title: String,
  posted: {
    type: Date,
    default: Date.now,
  },
  link: String,
});


const Marquee = mongoose.model('Marquee', MarqueeSchema);

module.exports = { Marquee };
