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

const reviews_photos = 'reviews_photos';
const filePath = path.join(__dirname, '../../csvFiles/reviews/reviews_photos.csv');

const createTable = `
DROP TABLE IF EXISTS ${reviews_photos};
CREATE SEQUENCE photos_sequence;

CREATE TABLE IF NOT EXISTS ${reviews_photos} (
  id SERIAL PRIMARY KEY,
  reviews_id INT NOT NULL,
  url TEXT
);
CREATE INDEX photos_index ON ${reviews_photos}(reviews_id);
ALTER SEQUENCE photos_sequence OWNED BY ${reviews_photos}.id;`

client.query(createTable).then((res) => {
  console.log('Table successfully created!!!')
});

const stream = client.query(copyFrom(`COPY ${reviews_photos} FROM STDIN DELIMITER ',' CSV HEADER;`));
const fileStream = fs.createReadStream(filePath);

console.time('Execution Time');

fileStream.on('error', (error) =>{
  console.log(`Error in reading file: ${error}`)
})
stream.on('error', (error) => {
  console.log(`Error in copy command: ${error}`)
})
stream.on('finish', () => {
    console.log(`Completed loading data into ${reviews_photos} `)
    client.end();
})

fileStream.on('open', () => fileStream.pipe(stream));
fileStream.on('end', () => {
  console.log('Stream ended');
  console.timeEnd('Execution Time');
});

module.exports = client;