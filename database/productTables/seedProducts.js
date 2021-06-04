const config = '../config/config.js';
const { Client } = require('pg');
const csv = require('csv-parser');
const copyFrom = require('pg-copy-streams').from;
const fs = require('fs');
const path = require('path');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'sdc',
  password: '',
  port: 5432,
});

client.connect((err) => err ? console.error(err) : console.log('Database Success'));

const filePath = path.join(__dirname, '../../csvFiles/products/product.csv');
const products = 'products';

const createTable = `
DROP TABLE IF EXISTS ${products};
CREATE TABLE IF NOT EXISTS ${products} (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slogan TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  default_price VARCHAR DEFAULT NULL
);`;

client.query(createTable).then((res) => {
  console.log('Table successfully created!!!')
});

const stream = client.query(copyFrom(`COPY ${products} FROM STDIN DELIMITER ',' CSV HEADER;`));
const fileStream = fs.createReadStream(filePath);

console.time('Execution Time');

fileStream.on('error', (error) =>{
  console.log(`Error in reading file: ${error}`)
})
stream.on('error', (error) => {
  console.log(`Error in copy command: ${error}`)
})

const alterTable = `
ALTER TABLE ${products}
DROP COLUMN id,
ADD COLUMN id SERIAL PRIMARY KEY;
DROP INDEX IF EXISTS products_index;
CREATE INDEX IF NOT EXISTS products_index ON ${products}(id);
`;

stream.on('finish', () => {
  console.log(`Completed loading data into ${products}`);
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

module.exports = client