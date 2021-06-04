const { Pool } = require('pg');
const fs = require('fs');
const copyFrom = require('pg-copy-streams').from;
const path = require('path');
const config = '../config/config.js';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sdc',
  password: '',
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Successfully connected to the database!!');
  }
});

module.exports = pool;