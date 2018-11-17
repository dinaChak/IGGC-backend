// @ts-check
/* eslint-disable */ 
const chai = require('chai');

const {
  expect,
} = chai;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../index');
const {
  Branch,
} = require('../models/branch');
const {
  Student,
} = require('../models/student');
const {
  populateBranches,
  populateStudents,
  branches,
  students,
} = require('./seeds/seed');

beforeEach(populateBranches);
beforeEach(populateStudents);
afterEach(async () => {
  await Branch.deleteMany({});
  await Student.deleteMany({});
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

describe('BRANCH', () => {
  describe('GET /branch', function () {
    it('should return all branches', async () => {
      try {
        const res = await chai.request(app).get('/branch');
        expect(res).to.have.status(200);
        expect(res.body.branches).to.be.a('array');
        expect(res.body.branches.length).to.equal(branches.length);
      } catch (error) {
        throw error;
      }
    });
  });
});

// admin
describe('ADMIN', () => {
  describe('POST /admin/branch/create', function () {

    it('should create new branch', async () => {
      try {
        const res = await chai.request(app)
          .post('/admin/branch/create')
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

    it('should not create branch with no title', async () => {
      try {
        const res = await chai.request(app)
          .post('/admin/branch/create')
          .send({  });


        expect(res).to.have.status(422);
        expect(res.body.errors).to.be.a('array');
        expect(res.body.errors).to.deep.include({
          location: 'body',
          param: 'title',
          msg: 'title should not be empty'
        });
      } catch (error) {
        throw error;
      }
    });

    it('should not create duplicate branch', async () => {
      try {
        const title = branches[0].title;

        const res = await chai.request(app)
          .post('/admin/branch/create')
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
      } catch (error) {
        throw error;
      }
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
          'gender': 'male',
          'branch': branches[0]._id,
          'phoneNumber': '1234567890',
          'dateOfBirth': '1991-04-12'
        };
        const res = await chai.request(app)
          .post('/student/registration')
          .send(newStudent)

        expect(res).to.have.status(200);
        const student = await Student.findOne({ email: newStudent.email });
        expect(student).to.have.property('email', newStudent.email);
        expect(student.dateOfBirth.toISOString()).to.equal(new Date(newStudent.dateOfBirth).toISOString());
        expect(student.branch.toHexString()).to.have.equal(branches[0]._id.toHexString());
      } catch (error) {
        throw error;
      }
    });

    it('should not create new student with invalid data', async () => {
      try {
        const newStudent = {
          'email': 'deep@.com',
          'name': '',
          'password': 'password',
          'confirmPassword': 'password123',
          'gender': 'test',
          'branch': '123afadfaadfadkfkja',
          'phoneNumber': '1234567',
          'dateOfBirth': '1991-04-12444'
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

        expect(res.body.errors).to.deep.include({
          location: 'body',
          param: 'branch',
          value: newStudent.branch,
          msg: 'Invalid branch'
        });

      } catch (error) {
        throw error;
      }
    });

    it('should not create student duplicate email', async () => {
      try {
        const newStudent = {
          'email': students[0].email,
          'name': students[0].name,
          'password': 'password123',
          'confirmPassword': 'password123',
          'gender': 'male',
          'branch': branches[0]._id,
          'phoneNumber': '1234567890',
          'dateOfBirth': '1991-04-12'
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
      } catch (error) {
        throw error;
      }
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

});
