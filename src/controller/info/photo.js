const { Photo } = require('../../models/photo');

const getPhotos = async (req, res) => {
  try {
    const {
      album,
      limit = 10,
      page = 0,
    } = req.query;
    // const photos = await Photo.find({ album })
    //   .limit(Number(limit))
    //   .skip(Number(page) * Number(limit));

    const response = await Promise.all([
      Photo
        .find({ album })
        .limit(Number(limit))
        .skip(Number(page) * Number(limit))
        .sort('-posted'),
      Photo.countDocuments({ album }),
    ]);
    res.send({
      photos: response[0],
      totalCount: response[1],
    });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = { getPhotos };
