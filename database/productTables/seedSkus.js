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

const filePath = path.join(__dirname, '../../csvFiles/products/skus.csv');
const skus = 'skus';

const createTable = `
DROP TABLE IF EXISTS ${skus};
CREATE SEQUENCE skus_sequence;

CREATE TABLE IF NOT EXISTS ${skus} (
  id SERIAL PRIMARY KEY,
  style_id INTEGER DEFAULT NULL,
  size TEXT DEFAULT NULL,
  quantity INTEGER DEFAULT NULL
);
CREATE INDEX skus_index ON ${skus}(id);
ALTER SEQUENCE skus_sequence OWNED BY ${skus}.id;`

client.query(createTable).then((res) => {
  console.log('Table successfully created!!!')
});

const stream = client.query(copyFrom(`COPY ${skus} FROM STDIN DELIMITER ',' CSV HEADER;`));
const fileStream = fs.createReadStream(filePath);

console.time('Execution Time');

fileStream.on('error', (error) =>{
  console.log(`Error in reading file: ${error}`)
})
stream.on('error', (error) => {
  console.log(`Error in copy command: ${error}`)
})
stream.on('finish', () => {
    console.log(`Completed loading data into ${skus} `)
    client.end();
})

fileStream.on('open', () => fileStream.pipe(stream));
fileStream.on('end', () => {
  console.log('Stream ended');
  console.timeEnd('Execution Time');
});

module.exports = client;