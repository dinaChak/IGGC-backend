const _ = require('lodash');

const { Photo } = require('../../models/photo');
const deleteFile = require('../../utilities/delete_file_promise');


const createPhoto = async (req, res) => {
  try {
    let body = _.pick(req.body, ['title', 'subtitle', 'album', 'description']);
    body = {
      ...body,
      image: {
        path: req.file.path,
        fileName: req.file.fileName,
        baseDir: req.file.baseDir,
        link: req.file.link,
      },
    };
    const photo = new Photo(body);
    await photo.save();
    res.send({ photo });
  } catch (error) {
    res.status(500).send();
  }
};


const updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    let body = _.pick(req.body, ['title', 'subtitle', 'album', 'description']);
    if (req.file) {
      const photoObj = await Photo.findById(id);
      await deleteFile(photoObj.image.path);
      body = {
        ...body,
        image: {
          path: req.file.path,
          fileName: req.file.fileName,
          baseDir: req.file.baseDir,
          link: req.file.link,
        },
      };
    }
    const photo = await Photo.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );
    res.send({ photo });
  } catch (error) {
    res.status(500).send();
  }
};

const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findByIdAndDelete(id);
    if (photo) {
      await deleteFile(photo.image.path);
    }
    res.send({ photo });
  } catch (error) {
    res.status(500).send();
  }
};


const uploadPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findByIdAndUpdate(
      id,
      { $set: { img: req.file.path } },
      {
        new: true,
      },
    );
    return res.send({ photo });
  } catch (error) {
    return res.status(500).send();
  }
};


module.exports = {
  createPhoto,
  uploadPhoto,
  updatePhoto,
  deletePhoto,
};
