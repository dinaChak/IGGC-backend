const { Router } = require('express');
const multer = require('multer');
const path = require('path');


const imgurStorage = require('../utilities/imgur_storage');

const router = Router();

// upload student image
const imageStorage = imgurStorage({
  images: [
    480,
    480,
    'inside',
  ],
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: (req, file, callback) => {
    console.log('file');
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'), false);
    }
    return callback(null, true);
  },
}).single('image');

const uploadImage = (req, res) => {
  imageUpload(req, res, async (err) => {
    if (err) {
      return res.status(422).send({ errors: [{ msg: err.message }] });
    }

    console.log(req.file);
    return res.send(req.file);
  });
};

router.post('/', uploadImage);

module.exports = router;
