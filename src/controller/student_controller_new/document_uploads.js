const path = require('path');
const multer = require('multer');

const { Student } = require('../../models/student');
const { StudentInstance } = require('../../models/studentInstance');
// const myCustomStorage = require('../../utilities/my_custom_storage');
const myCustomStorage = require('../../utilities/imgur_storage');


// upload student image
const profileImageStorage = myCustomStorage({
  images: [
    480,
    480,
    'inside',
  ],
});

const profileImageUpload = multer({
  storage: profileImageStorage,
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'), false);
    }
    return callback(null, true);
  },
}).single('profileImage');

const uploadProfileImage = (req, res) => {
  profileImageUpload(req, res, async (err) => {
    if (err) {
      return res.status(422).send({ errors: [{ msg: err.message }] });
    }

    try {
      const student = await Student.findOneAndUpdate(
        // eslint-disable-next-line
        { _id: req.user._id },
        { $set: { profileImage: req.file.path } },
        {
          new: true,
        },
      );
      return res.send({ student });
    } catch (error) {
      return res.status(500).send();
    }
  });
};


// upload student signature
const signatureImageStorage = myCustomStorage({
  images: [
    280,
    280,
    'inside',
  ],
});

const signatureImageUpload = multer({
  storage: signatureImageStorage,
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'), false);
    }
    return callback(null, true);
  },
}).single('signature');

const uploadStudentSignature = (req, res) => {
  signatureImageUpload(req, res, async (err) => {
    if (err) {
      return res.status(422).send({ errors: [{ msg: err.message }] });
    }

    try {
      const student = await Student.findOneAndUpdate(
        // eslint-disable-next-line
        { _id: req.user._id },
        { $set: { signatureImage: req.file.path } },
        { new: true },
      );
      return res.send({ student });
    } catch (error) {
      return res.status(500).send();
    }
  });
};

// upload verification document
const verificationDocument = myCustomStorage({
  images: [
    720,
    720,
    'inside',
  ],
});

const verificationDocumentUpload = multer({
  storage: verificationDocument,
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'), false);
    }
    return callback(null, true);
  },
}).single('verificationDocument');

const uploadVerificationDocument = (req, res) => {
  verificationDocumentUpload(req, res, async (err) => {
    if (err) return res.status(422).send({ errors: [{ msg: err.message }] });
    try {
      const studentInstance = await StudentInstance.findOneAndUpdate(
        {
        // eslint-disable-next-line
        student: req.user._id,
        },
        {
          $set: {
            'admission.documentImage': req.file.path,
            'admission.status': 'verification',
          },
        },
        {
          new: true,
        },
      ).populate('student').populate('semester');
      return res.send({ studentInstance });
    } catch (error) {
      return res.status(500).send();
    }
  });
};

module.exports = {
  uploadProfileImage,
  uploadStudentSignature,
  uploadVerificationDocument,
};
