const uploadValidation = (req, res, next) => {
  if (res.locals.fileErrors) {
    res.status(422).send({ errors: res.locals.fileErrors });
  } else next();
};

module.exports = { uploadValidation };
