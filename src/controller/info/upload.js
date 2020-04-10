const { Upload } = require('../../models/upload');

const getUploads = async (req, res) => {
  try {
    const {
      limit = 10,
      page = 0,
    } = req.query;
    const response = await Promise.all([
      Upload.find({})
        .limit(Number(limit))
        .skip(Number(limit) * Number(page)),
      Upload.countDocuments({}),
    ]);
    res.send({
      uploads: response[0],
      totalCount: response[1],
    });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  getUploads,
};
