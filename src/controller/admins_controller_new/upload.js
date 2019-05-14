const { Upload } = require('../../models/upload');
const deleteFile = require('../../utilities/delete_file_promise');

const createUpload = async (req, res) => {
  try {
    const { title } = req.body;
    const upload = new Upload({
      title,
      file: {
        path: req.file.path,
        fileName: req.file.fileName,
        originalFileName: req.file.originalFileName,
        baseDir: req.file.baseDir,
        link: req.file.link,
        fileType: req.file.fileType,
      },
    });
    await upload.save();
    res.send({ upload });
  } catch (error) {
    res.status(500).send();
  }
};

const updateUpload = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    let body = { title };
    if (req.file) {
      const uploadObj = await Upload.findById(id);
      await deleteFile(uploadObj.file.path);
      body = {
        ...body,
        file: {
          path: req.file.path,
          fileName: req.file.fileName,
          originalFileName: req.file.originalFileName,
          baseDir: req.file.baseDir,
          link: req.file.link,
          fileType: req.file.fileType,
        },
      };
    }
    const upload = await Upload.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );
    res.send({ upload });
  } catch (error) {
    res.status(500).send();
  }
};

const deleteUpload = async (req, res) => {
  try {
    const { id } = req.params;
    const upload = await Upload.findByIdAndDelete(id);
    if (upload) {
      deleteFile(upload.file.path);
    }
    res.send({ upload });
  } catch (error) {
    res.status(500).send();
  }
};


module.exports = {
  createUpload,
  updateUpload,
  deleteUpload,
};
