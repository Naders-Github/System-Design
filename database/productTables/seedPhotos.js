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

const filePath = path.join(__dirname, '../../csvFiles/products/photos.csv');
const photos = 'photos';

const createTable = `
DROP TABLE IF EXISTS ${photos};
CREATE SEQUENCE product_photos_sequence;

CREATE TABLE IF NOT EXISTS ${photos} (
  id SERIAL,
  style_id INTEGER DEFAULT NULL,
  url TEXT,
  thumbnail_url TEXT
);
CREATE INDEX product_photos_index ON ${photos}(id);
ALTER SEQUENCE product_photos_sequence OWNED BY ${photos}.id;`

client.query(createTable).then((res) => {
  console.log('Table successfully created!!!')
});

const stream = client.query(copyFrom(`COPY ${photos} FROM STDIN DELIMITER ',' CSV HEADER;`));
const fileStream = fs.createReadStream(filePath);

console.time('Execution Time');

fileStream.on('error', (error) =>{
  console.log(`Error in reading file: ${error}`)
})
stream.on('error', (error) => {
  console.log(`Error in copy command: ${error}`)
})
stream.on('finish', () => {
    console.log(`Completed loading data into ${photos} `)
    client.end();
})

fileStream.on('open', () => fileStream.pipe(stream));
fileStream.on('end', () => {
  console.log('Stream ended');
  console.timeEnd('Execution Time');
});

module.exports = client;