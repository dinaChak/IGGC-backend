const _ = require('lodash');

const { Syllabus } = require('../../models/syllabus');
const deleteFile = require('../../utilities/delete_file_promise');

const createSyllabus = async (req, res) => {
  try {
    let body = _.pick(req.body, ['title', 'branch']);
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
    const syllabus = new Syllabus(body);
    await syllabus.save();
    res.send({ syllabus });
  } catch (error) {
    res.status(500).send();
  }
};

const updateSyllabus = async (req, res) => {
  try {
    const { id } = req.params;
    let body = _.pick(req.body, ['title', 'branch']);
    if (req.file) {
      const syllabusObj = await Syllabus.findById(id);
      await deleteFile(syllabusObj.file.path);
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
    const syllabus = await Syllabus.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );
    res.send({ syllabus });
  } catch (error) {
    res.status(500).send();
  }
};

const deleteSyllabus = async (req, res) => {
  try {
    const { id } = req.params;
    const syllabus = await Syllabus.findByIdAndDelete(id);
    if (syllabus) {
      await deleteFile(syllabus.file.path);
    }
    res.send({ syllabus });
  } catch (error) {
    res.status(500).send();
  }
};


module.exports = {
  createSyllabus,
  updateSyllabus,
  deleteSyllabus,
};
