const config = '../config/config.js';
const { Client } = require('pg');
const csv = require('csv-parser');
const copyFrom = require('pg-copy-streams').from;
const fs = require('fs');
const path = require('path');

const client = new Client({
  user: 'naderdamouni',
  host: 'localhost',
  database: 'sdc',
  password: config.TOKEN,
  port: 5432,
});

client.connect((err) => err ? console.error(err) : console.log('Database Success'));

const filePath = path.join(__dirname, '../csvFiles/reviews.csv');
const reviews = 'reviews';

const createTable = `
DROP TABLE IF EXISTS ${reviews};
CREATE SEQUENCE reviews_sequence;

CREATE TABLE IF NOT EXISTS ${reviews} (
  id SERIAL,
  product_id INTEGER DEFAULT NULL,
  rating INTEGER DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NULL,
  summary TEXT DEFAULT NULL,
  body TEXT DEFAULT NULL,
  recommend BOOLEAN DEFAULT NULL,
  reported BOOLEAN DEFAULT NULL,
  reviewer_name TEXT DEFAULT NULL,
  reviewer_email TEXT DEFAULT NULL,
  response TEXT DEFAULT NULL,
  helpfulness INTEGER DEFAULT NULL
);
CREATE INDEX review_index ON ${reviews}(id);
ALTER SEQUENCE reviews_sequence OWNED BY ${reviews}.id;`

client.query(createTable).then((res) => {
  console.log('Table successfully created!!!')
});

const stream = client.query(copyFrom(`COPY ${reviews} FROM STDIN DELIMITER ',' CSV HEADER;`));
const fileStream = fs.createReadStream(filePath);

console.time('Execution Time');

fileStream.on('error', (error) =>{
  console.log(`Error in reading file: ${error}`)
})
stream.on('error', (error) => {
  console.log(`Error in copy command: ${error}`)
})
stream.on('finish', () => {
    console.log(`Completed loading data into ${reviews} `)
    client.end();
})

fileStream.on('open', () => fileStream.pipe(stream));
fileStream.on('end', () => {
  console.log('Stream ended');
  console.timeEnd('Execution Time');
});

module.exports = client;