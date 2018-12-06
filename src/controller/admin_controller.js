const _ = require('lodash');
const jwt = require('jsonwebtoken');

const { Admin } = require('../models/admin');
const { Branch } = require('../models/branch');
const { Admission } = require('../models/admission');
const { Session } = require('../models/session');
const { StudentInstance } = require('../models/studentInstance');
const { comparePassword } = require('../utilities/compare_password');

// creates new branch
const createBranchController = async (req, res) => {
  const { title } = req.body;

  try {
    const branch = new Branch({ title });
    await branch.save();
    res.json({
      branch,
    });
  } catch (error) {
    res.status(500).send();
  }
};

// registers new admin
const registrationController = async (req, res) => {
  const body = _.pick(req.body, ['name', 'password', 'role']);
  try {
    const newAdmin = new Admin(body);
    await newAdmin.save();
    return res.send();
  } catch (error) {
    return res.status(500).send();
  }
};

// admin login
const loginController = async (req, res) => {
  const { name, password } = req.body;
  try {
    const admin = await Admin.findOne({ name });
    if (!admin) {
      const error = new Error('Name does not exists');
      error.status = 422;
      throw error;
    }
    const isPasswordCorrect = await comparePassword(password, admin.password);
    if (!isPasswordCorrect) {
      const error = new Error('Wrong password');
      error.status = 422;
      throw error;
    }

    // eslint-disable-next-line
    const token = jwt.sign({ _id: admin._id, access: admin.role }, process.env.JWT_SECRET, { expiresIn: '7h' });
    return res.header('x-auth', token).send(admin);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).send({
        errors: [{
          msg: error.message,
        }],
      });
    }
    return res.status(500).send();
  }
};

// create new admission
const createAdmission = async (req, res) => {
  const admissionBody = {
    openingDate: req.body.openingDate,
    closingDate: req.body.closingDate,
    openFor: req.body.openFor,
  };
  const sessionBody = _.pick(req.body, ['from', 'to']);
  try {
    const admission = await Admission.find();
    const session = new Session(sessionBody);
    await session.save();
    if (admission.length === 0) {
      const newAdmission = new Admission({
        ...admissionBody,
        // eslint-disable-next-line
        session: session._id,
      });
      await newAdmission.save();
      res.send({
        admission: newAdmission,
        session,
      });
    } else {
      const updatedAdmission = await Admission.findByIdAndUpdate(
        // eslint-disable-next-line
        admission[0]._id,
        {
          $set: {
            ...admissionBody,
            updated: Date.now(),
            // eslint-disable-next-line
            session: session._id,
          },
        },
        { new: true },
      );
      res.send({
        admission: updatedAdmission,
        session,
      });
    }
  } catch (error) {
    res.status(500).send();
  }
};

// get new Applicants
const getApplicants = async (req, res) => {
  try {
    const studentInstance = await StudentInstance.find({
      newRegistration: true,
    })
      .sort('appliedOn')
      .populate('student')
      .populate('semester');
    res.send({ newApplicants: studentInstance });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

// get Applicant count
const getNewApplicantCount = async (req, res) => {
  try {
    const newApplicantCount = await StudentInstance.find({
      newRegistration: true,
    }).count();
    return res.send({
      newApplicantCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};

// get the studentInstance with a given id
const getStudentInstanceWithId = async (req, res) => {
  try {
    const { id } = req.params;

    const studentInstance = await StudentInstance.findById(id).populate('semester').populate('student');
    res.send({ studentInstance });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

// update the studentInstance with a given id
const updateStudentInstanceValidationStatusWidthId = async (req, res) => {
  try {
    const { id } = req.params;
    const { verificationStatus } = req.body;
    const studentInstance = await StudentInstance.findByIdAndUpdate(id, {
      $set: {
        verificationStatus,
      },
    }, {
      new: true,
    });
    if (!studentInstance) {
      return res.status(400).send();
    }
    return res.send({ studentInstance });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};


// get student count
const getStudentCount = async (req, res) => {
  try {
    const studentCount = await StudentInstance.find({ newRegistration: false }).count();

    return res.send({
      studentCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};


module.exports = {
  registrationController,
  loginController,
  createBranchController,
  createAdmission,
  getNewApplicantCount,
  getApplicants,
  getStudentCount,
  getStudentInstanceWithId,
  updateStudentInstanceValidationStatusWidthId,
};
