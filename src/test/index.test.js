// @ts-check
/* eslint-disable */ 
const jwt = require('jsonwebtoken');
const { Types } = require('mongoose');
const chai = require('chai');

const {
  expect,
} = chai;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../index');
const { Admin } = require('../models/admin');
const { Student } = require('../models/student');
const { Branch } = require('../models/branch');
const { Admission } = require('../models/admission');
const {
  populateAdmins,
  populateBranches,
  populateStudents,
  populateAdmission,
  admins,
  branches,
  students,
  admission,
} = require('./seeds/seed');

beforeEach(populateBranches);
beforeEach(populateStudents);
beforeEach(populateAdmins);
beforeEach(populateAdmission);
afterEach(async () => {
  await Admin.deleteMany({});
  await Branch.deleteMany({});
  await Student.deleteMany({});
  await Admission.deleteMany({});
});
after(async () => {
  await Admin.deleteMany({});
  await Branch.deleteMany({});
  await Student.deleteMany({});
  await Admission.deleteMany({});
});

describe('GET /', () => {
  it('should return status code 200', async () => {
    try {
      const res = await chai.request(app).get('/')
      expect(res).to.have.status(200);
    } catch (error) {
      throw error;
    }
  });
});

describe('INFO', () => {

  describe('GET /info/branches', function () {
    it('should return all branches', async () => {
      const res = await chai.request(app).get('/info/branches');
      
      expect(res).to.have.status(200);
      expect(res.body.branches).to.be.a('array');
      expect(res.body.branches.length).to.equal(branches.length);
    });
  });

  describe('GET /info/admission', function () {

    it('should return admission', async () => {
      const res = await chai.request(app).get('/info/admission');
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('openingDate', admission.openingDate.toISOString());
      expect(res.body).to.have.property('closingDate', admission.closingDate.toISOString());
      expect(res.body).to.have.property('semester', admission.semester);
    });

  });

});

// admin
describe('ADMIN', () => {

  describe('POST /admin/register', function() {

    it('should create new admin', async () => {
      const admin = {
        name: 'john',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'admin'
      };

      const res = await chai.request(app)
        .post('/admin/register')
        .send(admin)

        expect(res).to.have.status(200);

        const adminsCount = await Admin.estimatedDocumentCount();
        expect(adminsCount).to.equal(admins.length + 1);
    });

    it('should not create admin with invalid form input', async () => {
      const admin = {
        name: '',
        password: 'password',
        confirmPassword: 'password123',
        role: 'other'
      };

      const res = await chai.request(app)
        .post('/admin/register')
        .send(admin)

        expect(res).to.have.status(422);
        expect(res.body.errors).to.a('array');
        expect(res.body.errors).to.deep.include({ 
          location: 'body',
          param: 'name',
          value: admin.name,
          msg: 'name should not be empty' 
        });
        expect(res.body.errors).to.deep.include({ 
          location: 'body',
          param: 'password',
          value: admin.password,
          msg: 'must contain a number' 
        });
        expect(res.body.errors).to.deep.include({ 
          location: 'body',
          param: 'confirmPassword',
          value: admin.confirmPassword,
          msg: 'Password confirmation does not match password' 
        });
        expect(res.body.errors).to.deep.include({ 
          location: 'body',
          param: 'role',
          value: admin.role,
          msg: 'Role should be Admin or Staff' 
        });
    });

    it('should not create duplicate admin', async () => {
      const admin = {
        name: admins[0].name,
        password: admins[0].password,
        confirmPassword: admins[0].password,
        role: admins[0].role
      };

      const res = await chai.request(app)
        .post('/admin/register')
        .send(admin)

      expect(res).to.have.status(422);
      expect(res.body.errors).deep.include({
        location: 'body',
        param: 'name',
        value: admin.name,
        msg: 'Name already in use' 
      });

      const adminsCount = await Admin.estimatedDocumentCount();
      expect(adminsCount).to.equal(admins.length);
    });

  });

  describe('POST /admin/login', function () {

    it('should login a valid admin', async () => {
      const res = await chai.request(app)
        .post('/admin/login')
        .send({
          name: admins[0].name,
          password: admins[0].password
        });

        expect(res).to.have.status(200);
        expect(res).to.have.header('x-auth');
        expect(res.body).to.deep.include({
          name: admins[0].name.toLowerCase(),
          role: admins[0].role
        });
    });

    it('should not login a invalid admin', async () => {
      const admin = {
        name: 'Abishek',
        password: admins[0].password
      };

      const res = await chai.request(app)
        .post('/admin/login')
        .send(admin);

      expect(res).to.have.status(401);
      expect(res.body.errors).to.deep.include({
        msg: 'Invalid name or password',
      });
    });

  });

  describe('POST /admin/branch/create', function () {

    it('should create new branch for Admin with role "admin"', async () => {
      try {
        const token = jwt.sign({ _id: admins[0]._id, access: admins[0].role }, process.env.JWT_SECRET, { expiresIn: '7h' });
        const res = await chai.request(app)
          .post('/admin/branch/create')
          .set('x-auth', token)
          .send({
            'title': 'Engineering'
          });

        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('success');
        const totalBranches = await Branch.estimatedDocumentCount();
        expect(totalBranches).to.equal(branches.length + 1);
      } catch (error) {
        throw error;
      }
    });

    it('should not create new branch for Admin with role "staff"', async () => {
      const token = jwt.sign({ _id: admins[1]._id, access: admins[1].role }, process.env.JWT_SECRET, { expiresIn: '7h' });
      const res = await chai.request(app)
        .post('/admin/branch/create')
        .set('x-auth', token)
        .send({
          'title': 'Engineering'
        });

      expect(res).to.have.status(401);
      const totalBranches = await Branch.estimatedDocumentCount();
      expect(totalBranches).to.equal(branches.length);
    });

    it('should not create branch with no title', async () => {
      const token = jwt.sign({ _id: admins[0]._id, access: admins[0].role }, process.env.JWT_SECRET, { expiresIn: '7h' });
      const res = await chai.request(app)
          .post('/admin/branch/create')
          .set('x-auth', token)
          .send({  });


        expect(res).to.have.status(422);
        expect(res.body.errors).to.be.a('array');
        expect(res.body.errors).to.deep.include({
          location: 'body',
          param: 'title',
          msg: 'title should not be empty'
        });
    });

    it('should not create duplicate branch', async () => {
      const token = jwt.sign({ _id: admins[0]._id, access: admins[0].role }, process.env.JWT_SECRET, { expiresIn: '7h' });
      const title = branches[0].title;

        const res = await chai.request(app)
          .post('/admin/branch/create')
          .set('x-auth', token)
          .send({ title })

        expect(res).to.have.status(422);
        expect(res.body.errors).to.be.a('array');
        expect(res.body.errors).to.deep.include({
          location: 'body',
          param: 'title',
          value: title,
          msg: 'Branch exists'
        });
        const branchCount = await Branch.estimatedDocumentCount();
        expect(branchCount).to.equal(branches.length);
    });
  });

  describe('PUT /admin/admission/create', function() {

    it('should create new admission', async () => {
      const token = jwt.sign({ _id: admins[0]._id, access: admins[0].role }, process.env.JWT_SECRET, { expiresIn: '7h' });

      const admission = {
        openingDate: '2018-11-22',
        closingDate: '2018-12-27',
        semester: 'even',
      };

      const res = await chai.request(app)
        .put('/admin/admission/create')
        .set('x-auth', token)
        .send(admission);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('openingDate', new Date(admission.openingDate).toISOString()); 
      expect(res.body).to.have.property('closingDate', new Date(admission.closingDate).toISOString()); 
      expect(res.body).to.have.property('semester', admission.semester); 
      expect(res.body).to.have.property('_id'); 
    });

    it('should not create admission for invalid form input', async () => {
      const token = jwt.sign({ _id: admins[0]._id, access: admins[0].role }, process.env.JWT_SECRET, { expiresIn: '7h' });

      const admission = {
        openingDate: '2018-22',
        closingDate: '2018-12-27',
        semester: 'other',
      };

      const res = await chai.request(app)
        .put('/admin/admission/create')
        .set('x-auth', token)
        .send(admission);

      expect(res).to.have.status(422);
      expect(res.body.errors).to.deep.include({
        location: 'body',
        param: 'openingDate',
        value: admission.openingDate,
        msg: 'Must be a ISO Date'
      });

      expect(res.body.errors).to.deep.include({
        location: 'body',
        param: 'semester',
        value: admission.semester,
        msg: 'semester must be even or odd'
      });
    });

    it('should not create  admission for invalid admin token', async () => {
      const token = jwt.sign({ _id: admins[0]._id, access: admins[0].role }, 'adfadfadsf', { expiresIn: '7h' });

      const admission = {
        openingDate: '2018-11-22',
        closingDate: '2018-12-27',
        semester: 'even',
      };

      const res = await chai.request(app)
        .put('/admin/admission/create')
        .set('x-auth', token)
        .send(admission);

      expect(res).to.have.status(401);
    });

  });
});

// Students
describe('STUDENT', () => {


  describe('POST /student/registration', function() {
    it('should register a new student', async () => {
      try {
        const newStudent = {
          'email': 'johndoe@test.com',
          'name': 'John Doe',
          'password': 'password123',
          'confirmPassword': 'password123',
        };
        const res = await chai.request(app)
          .post('/student/registration')
          .send(newStudent)

        expect(res).to.have.status(200);
        const student = await Student.findOne({ email: newStudent.email });
        expect(student).to.have.property('email', newStudent.email);
      } catch (error) {
        throw error;
      }
    });

    it('should not create new student with invalid data', async () => {
      const newStudent = {
        'email': 'deep@.com',
        'name': '',
        'password': 'password',
        'confirmPassword': 'password123',
      };

      const res = await chai.request(app)
        .post('/student/registration')
        .send(newStudent);

      expect(res).to.have.status(422);
      expect(res.body.errors).to.be.a('array');
      expect(res.body.errors).to.deep.include({
        location: 'body',
        param: 'email',
        value: newStudent.email,
        msg: 'Invalid email'
      });
      expect(res.body.errors).to.deep.include({
        location: 'body',
        param: 'password',
        value: newStudent.password,
        msg: 'must contain a number'
      });
    });

    it('should not create student duplicate email', async () => {
      const newStudent = {
        'email': students[0].email,
        'name': students[0].name,
        'password': 'password123',
        'confirmPassword': 'password123',
      };

      const res = await chai.request(app)
        .post('/student/registration')
        .send(newStudent);

      expect(res).to.have.status(422);
      expect(res.body.errors).to.deep.include({
        location: 'body',
        param: 'email',
        value: newStudent.email,
        msg: 'E-mail already in use'
      });

    const studentCount = await Student.estimatedDocumentCount();
    expect(studentCount).to.equal(students.length);
    });

  });

  describe('POST /student/login', function() {

    it('should login a student with correct credentials', async () => {
      const student = {
        email: students[0].email,
        password: students[0].password
      };

      const res = await chai.request(app)
        .post('/student/login')
        .send(student);
      expect(res).to.have.status(200);
      expect(res.body).to.deep.include({
        email: students[0].email,
        phoneNumber: students[0].phoneNumber
      });
      expect(res).to.have.header('x-auth');
    });

    it('should not login a student with incorrect email', async () => {
      const student = {
        email: 'test300@example.com',
        password: 'password123'
      };

      const res = await chai.request(app)
        .post('/student/login')
        .send(student);

      expect(res).to.have.status(401);
      expect(res.body.errors).to.deep.include({
        msg: "Invalid email or password"
      });
    });

    it('should not login a student with incorrect password', async () => {
      const student = {
        email: students[0].email,
        password: 'password123'
      };

      const res = await chai.request(app)
        .post('/student/login')
        .send(student);

      expect(res).to.have.status(401);
      expect(res.body.errors).to.deep.include({
        msg: "Invalid email or password"
      });
    });

    it('should not login a student with invalid email', async () => {
      const student = {
        email: 'john@.com',
        password: 'password123'
      };

      const res = await chai.request(app)
        .post('/student/login')
        .send(student);

      expect(res).to.have.status(422);
      expect(res.body.errors).to.deep.include({
        location: 'body',
        param: 'email',
        value: student.email,
        msg: 'Invalid E-mail address'
      });
    });

  });

  describe.only('PUT /student/update', function () {

    const student = {
      email: students[2].email,
      name: students[2].name,
      fatherName: 'father',
      motherName: 'mother',
      dateOfBirth: '1991-02-02',
      gender: 'male',
      phoneNumber: '9876543210',
      permanentAddress: 'Minister Line Tezu',
      presentAddress: 'Minister Line Tezu',
      religion: 'atheist',
      category: 'st',
      nationality: 'indian',
    };
     // eslint-disable-next-line
     const token = jwt.sign({ _id: students[2]._id, access: 'student', }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    it('should update student collection with valid form input', async () => {
      const res = await chai.request(app)
        .put('/student/update')
        .set('x-auth', token)
        .send(student);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('_id', students[2]._id.toHexString());
      expect(res.body).to.have.property('nationality', student.nationality);
      expect(res.body).to.have.property('name', student.name);
      expect(res.body).to.have.property('phoneNumber', student.phoneNumber);
    });

    it('should not update student collection with invalid form input', async () => {
      const invalidStudent = {
        ...student,
        religion: '',
        presentAddress: '',
        phoneNumber: '123'
      };

      const res = await chai.request(app)
        .put('/student/update')
        .set('x-auth', token)
        .send(invalidStudent);

      
      expect(res).to.have.status(422);
      expect(res.body.errors).to.deep.include({
        location: 'body',
        param: 'religion',
        value: invalidStudent.religion,
        msg: 'must provide religion'
      });
      expect(res.body.errors).to.deep.include({
        location: 'body',
        param: 'presentAddress',
        value: '',
        msg: 'presentAddress should not be empty'
      });
      expect(res.body.errors).to.deep.include({
        location: 'body',
        param: 'presentAddress',
        value: '',
        msg: 'presentAddress should not be empty' 
      });
    });

  });

});
