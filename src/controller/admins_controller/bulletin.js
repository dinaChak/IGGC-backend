const _ = require('lodash');

const { Bulletin } = require('../../models/bulletin');
const deleteFile = require('../../utilities/delete_file_promise');

const createBulletin = async (req, res) => {
  try {
    let body = _.pick(req.body, ['title', 'description', 'body', 'type']);
    body = {
      ...body,
      attachment: {
        path: req.file.path,
        fileName: req.file.fileName,
        baseDir: req.file.baseDir,
        link: req.file.link,
      },
    };
    const bulletin = new Bulletin(body);
    await bulletin.save();
    res.send({ bulletin });
  } catch (error) {
    res.status(500).send();
  }
};

const updateBulletin = async (req, res) => {
  try {
    const { id } = req.params;
    let body = _.pick(req.body, ['title', 'description', 'body', 'type']);
    if (req.file) {
      const bulletinObj = await Bulletin.findById(id);
      await deleteFile(bulletinObj.attachment.path);
      body = {
        ...body,
        attachment: {
          path: req.file.path,
          fileName: req.file.fileName,
          baseDir: req.file.baseDir,
          link: req.file.link,
        },
      };
    }
    const bulletin = await Bulletin.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );
    res.send({ bulletin });
  } catch (error) {
    res.status(500).send();
  }
};

const deleteBulletin = async (req, res) => {
  try {
    const { id } = req.params;
    const bulletin = await Bulletin.findByIdAndDelete(id);
    if (bulletin.attachment.fileName) {
      await deleteFile(bulletin.attachment.path);
    }
    res.send({ bulletin });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createBulletin,
  updateBulletin,
  deleteBulletin,
};
