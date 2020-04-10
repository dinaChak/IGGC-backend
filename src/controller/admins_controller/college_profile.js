const _ = require('lodash');

const { CollegeProfile } = require('../../models/college_profile');
const deleteFile = require('../../utilities/delete_file_promise');

const createCollegeProfile = async (req, res) => {
  try {
    let body = _.pick(req.body, ['body']);
    body = {
      ...body,
      image: {
        path: req.file.path,
        fileName: req.file.fileName,
        baseDir: req.file.baseDir,
        link: req.file.link,
      },
    };
    const collegeProfile = new CollegeProfile(body);
    await collegeProfile.save();
    res.send({ collegeProfile });
  } catch (error) {
    res.status(500).send();
  }
};

const updateCollegeProfile = async (req, res) => {
  try {
    const { id } = req.params;
    let body = _.pick(req.body, ['body']);
    if (req.file) {
      const collegeProfileObj = await CollegeProfile.findById(id);
      await deleteFile(collegeProfileObj.image.path);
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
    const collegeProfile = await CollegeProfile.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );
    res.send({ collegeProfile });
  } catch (error) {
    res.status(500).send();
  }
};

const deleteCollegeProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const collegeProfile = await CollegeProfile.findByIdAndDelete(id);
    if (collegeProfile) { await deleteFile(collegeProfile.image.path); }
    res.send({ collegeProfile });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createCollegeProfile,
  updateCollegeProfile,
  deleteCollegeProfile,
};
