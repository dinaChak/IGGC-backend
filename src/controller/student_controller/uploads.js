const _ = require('lodash');

const { Student } = require('../../models/student_new');
const deleteFile = require('../../utilities/delete_file_promise');

const updateStudentProfileImg = async (req, res) => {
  try {
    const { _id: id } = req.student;
    if (
      req.student.profile_image
      && !_.isEmpty(req.student.profile_image)
      && req.student.profile_image.path
    ) {
      await deleteFile(req.student.profile_image.path);
    }
    const student = await Student.findByIdAndUpdate(
      id,
      {
        $set: {
          profile_image: {
            path: req.file.path,
            fileName: req.file.fileName,
            baseDir: req.file.baseDir,
            link: req.file.link,
          },
        },
      },
      { new: true },
    );
    res.send({ student });
  } catch (error) {
    res.status(500).send();
  }
};

const updateStudentSignatureImg = async (req, res) => {
  try {
    const { _id: id } = req.student;
    if (
      req.student.signature_image
      && !_.isEmpty(req.student.signature_image)
      && req.student.signature_image.path
    ) {
      await deleteFile(req.student.signature_image.path);
    }
    const student = await Student.findByIdAndUpdate(
      id,
      {
        $set: {
          signature_image: {
            path: req.file.path,
            fileName: req.file.fileName,
            baseDir: req.file.baseDir,
            link: req.file.link,
          },
        },
      },
      { new: true },
    );
    res.send({ student });
  } catch (error) {
    res.status(500).send();
  }
};

const studentVerificationDocument = async (req, res) => {
  try {
    const { _id: id } = req.student;
    const { title } = req.body;
    let query = [
      {
        _id: id,
      },
      {
        $push: {
          verification_documents: {
            title,
            file: {
              path: req.file.path,
              fileName: req.file.fileName,
              baseDir: req.file.baseDir,
              link: req.file.link,
            },
          },
        },
      },
      { new: true },
    ];
    if (req.student.verification_documents) {
      const doc = req.student.verification_documents
        .find(document => document.title === title);
      if (doc) {
        await deleteFile(doc.file.path);
        query = [
          {
            _id: id,
            // eslint-disable-next-line
            'verification_documents._id': doc._id,
          },
          {
            $set: {
              'verification_documents.$': {
                title,
                file: {
                  path: req.file.path,
                  fileName: req.file.fileName,
                  baseDir: req.file.baseDir,
                  link: req.file.link,
                },
              },
            },
          },
          { new: true },
        ];
      }
    }
    const student = await Student.findOneAndUpdate(...query);
    res.send({ student });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  updateStudentProfileImg,
  updateStudentSignatureImg,
  studentVerificationDocument,
};
