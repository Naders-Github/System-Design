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
  password: 'Sawyer22@',
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

const alterTable = `
ALTER TABLE ${styles}
DROP COLUMN id,
ADD COLUMN id SERIAL PRIMARY KEY;
DROP INDEX IF EXISTS styles_index;
CREATE INDEX IF NOT EXISTS styles_index ON ${styles}(product_id);
`;

stream.on('finish', () => {
  console.log(`Completed loading data into ${styles}`);
  console.log('Starting table alteration');
  console.time('Alter execution time');
  client.query(alterTable)
    .then(() => {
      console.log('Altered Successfully!')
      console.timeEnd('End Altered execution time!')
      client.end();
    })
    .catch((err) => {
      console.error(err);
    })
})

fileStream.on('open', () => fileStream.pipe(stream));
fileStream.on('end', () => {
  console.log('Stream ended');
  console.timeEnd('Execution Time');
});

module.exports = client;