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

const filePath = path.join(__dirname, '../csvFiles/characteristic_reviews.csv');
const characteristic_reviews = 'characteristic_reviews';

const createTable = `
DROP TABLE IF EXISTS ${characteristic_reviews};
CREATE SEQUENCE characteristic_reviews_sequence;

CREATE TABLE IF NOT EXISTS ${characteristic_reviews} (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  value INTEGER NOT NULL
);
CREATE INDEX characteristic_reviews_index ON ${characteristic_reviews}(product_id);
ALTER SEQUENCE characteristic_reviews_sequence OWNED BY ${characteristic_reviews}.id`

client.query(createTable)
  .then((res) => {
    console.log('Table successfully created!!!');
  })
  .catch((err) => console.error(err));


const stream = client.query(copyFrom(`COPY ${characteristic_reviews} FROM STDIN DELIMITER ',' CSV HEADER;`));
const fileStream = fs.createReadStream(filePath);

console.time('Execution Time');

fileStream.on('error', (error) =>{
  console.log(`Error in reading file: ${error}`)
})
stream.on('error', (error) => {
  console.log(`Error in copy command: ${error}`)
})
stream.on('finish', () => {
    console.log(`Completed loading data into ${characteristic_reviews} `)
    client.end();
})

fileStream.on('open', () => fileStream.pipe(stream));
fileStream.on('end', () => {
  console.log('Stream ended');
  console.timeEnd('Execution Time');
});