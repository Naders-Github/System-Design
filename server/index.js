// const newrelic = require('newrelic');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const router = require('./router.js');

const app = express();
const PORT = 3000;

// app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api', router);
// app.use(express.static(path.join(__dirname, '../public/dist')))

app.get('/loaderio-732b50797b656841392130dd9b3f1112', (req, res) => {
  res.send('loaderio-732b50797b656841392130dd9b3f1112');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
}