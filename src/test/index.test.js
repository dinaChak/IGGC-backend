const chai = require('chai');
const {
  expect
} = chai;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../index');

describe('GET /', function () {
  it('should return status code 200', (done) => {
    chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.have.status(200);
        done();
      })
      .catch(done);
  });
});