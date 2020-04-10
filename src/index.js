const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const moment = require('moment-timezone');

require('dotenv').config();
require('./db/mongoose');
require('./initial_setup');

if (process.env.NODE_ENV === 'development') {
  process.env.HOSTNAME = 'http://localhost:5000';
} else {
  process.env.HOSTNAME = 'http://iggc.org.in';
}
// const studentRoutesNew = require('./routes/student_route_new');
const adminRoutesNew = require('./routes/admin_routes_new');
const infoRoutesNew = require('./routes/info_routes_new');
const studentRoute = require('./routes/student_route');

// setup
const app = express();
const PORT = process.env.PORT || 5000;

// configure
app.use('/public', express.static(path.join(__dirname, '..', 'uploads')));
app.use(cors({ exposedHeaders: 'x-auth,x-token' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
morgan.token('date', (req, res, timezone) => moment().tz(timezone).format('DD/MMM/YY h:mm:ss a'));
morgan.format('local', '[:date[Asia/Kolkata]] :method :url :status :res[content-length] - :response-time ms');
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('local'));
}


// routes
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Hello World!',
//   });
// });

app.use('/student', studentRoute);
// app.use('/student/2', studentRoutesNew);
app.use('/admin', adminRoutesNew);
app.use('/admin/2', adminRoutesNew);
app.use('/info', infoRoutesNew);
app.use('/info/2', infoRoutesNew);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`server is listening on ${PORT}`));

module.exports = app;
