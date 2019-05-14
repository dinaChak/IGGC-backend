const _ = require('lodash');

const { Faculty } = require('../../models/faculty');
const deleteFile = require('../../utilities/delete_file_promise');

const createFaculty = async (req, res) => {
  try {
    let body = _.pick(
      req.body,
      [
        'name',
        'email',
        'address',
        'phone',
        'department',
        'designation',
        'seniority',
        'education_qualification',
        'date_of_join_as_prof_lec',
        'date_of_join_iggc',
        'net_slet',
        'additional_responsibilities',
        'other_information',
      ],
    );
    body = {
      ...body,
      image: {
        path: req.file.path,
        fileName: req.file.fileName,
        baseDir: req.file.baseDir,
        link: req.file.link,
      },
    };
    const faculty = new Faculty(body);
    await faculty.save();
    res.send({ faculty });
  } catch (error) {
    res.status(500).send();
  }
};

const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    let body = _.pick(
      req.body,
      [
        'name',
        'email',
        'address',
        'phone',
        'department',
        'designation',
        'seniority',
        'education_qualification',
        'date_of_join_as_prof_lec',
        'date_of_join_iggc',
        'net_slet',
        'additional_responsibilities',
        'other_information',
      ],
    );
    if (req.file) {
      const facultyObj = await Faculty.findById(id);
      // await gBucket.deleteFile(facultyObj.image.fileName);
      await deleteFile(facultyObj.image.path);
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
    const faculty = await Faculty.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );
    res.send({ faculty });
  } catch (error) {
    res.status(500).send();
  }
};

const updateFacultyPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findByIdAndUpdate(
      id,
      { $set: { 'image.link': req.file.path, 'image.deleteHash': req.file.deletehash } },
      { new: true },
    );
    res.send({ faculty });
  } catch (error) {
    res.status(500).send();
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findByIdAndDelete(id);
    if (faculty) { await deleteFile(faculty.image.path); }
    res.send({ faculty });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createFaculty,
  updateFaculty,
  updateFacultyPhoto,
  deleteFaculty,
};
