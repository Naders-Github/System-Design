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

const filePath = path.join(__dirname, '../../csvFiles/products/styles.csv');
const styles = 'styles';

const createTable = `
DROP TABLE IF EXISTS ${styles};
CREATE SEQUENCE styles_sequence;

CREATE TABLE IF NOT EXISTS ${styles} (
  id SERIAL PRIMARY KEY,
  product_id INTEGER DEFAULT NULL,
  name TEXT DEFAULT NULL,
  sale_price TEXT DEFAULT NULL,
  original_price INTEGER DEFAULT NULL,
  default_style BOOLEAN DEFAULT NULL
);
CREATE INDEX styles_index ON ${styles}(id);
ALTER SEQUENCE styles_sequence OWNED BY ${styles}.id;`

client.query(createTable).then((res) => {
  console.log('Table successfully created!!!')
});

const stream = client.query(copyFrom(`COPY ${styles} FROM STDIN DELIMITER ',' CSV HEADER;`));
const fileStream = fs.createReadStream(filePath);

console.time('Execution Time');

fileStream.on('error', (error) =>{
  console.log(`Error in reading file: ${error}`)
})
stream.on('error', (error) => {
  console.log(`Error in copy command: ${error}`)
})
stream.on('finish', () => {
    console.log(`Completed loading data into ${styles} `)
    client.end();
})

fileStream.on('open', () => fileStream.pipe(stream));
fileStream.on('end', () => {
  console.log('Stream ended');
  console.timeEnd('Execution Time');
});

module.exports = client;