// @ts-check
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

require('dotenv').config();
require('./db/mongoose');
require('./initial_setup');
const studentRoutesNew = require('./routes/student_route_new');
const adminRoutesNew = require('./routes/admin_routes_new');
const infoRoutesNew = require('./routes/info_routes_new');

// setup
const app = express();
const PORT = process.env.PORT || 5000;

// configure
app.use('/public', express.static(path.join(__dirname, '..', 'uploads')));
app.use(cors({ exposedHeaders: 'x-auth' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}


// routes
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

app.use('/student', studentRoutesNew);
app.use('/student/2', studentRoutesNew);
app.use('/admin', adminRoutesNew);
app.use('/admin/2', adminRoutesNew);
app.use('/info', infoRoutesNew);
app.use('/info/2', infoRoutesNew);

app.listen(PORT, () => console.log(`server is listening on ${PORT}`));

module.exports = app;
