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

app.get('/loaderio-9c92b2210fc2c3b1db84778c3ad2ad6f/', (req, res) => {
  res.send('loaderio-9c92b2210fc2c3b1db84778c3ad2ad6f');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
}