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

const filePath = path.join(__dirname, '../../csvFiles/reviews/characteristic_reviews.csv');
const characteristic_reviews = 'characteristic_reviews';

const createTable = `
DROP TABLE IF EXISTS ${characteristic_reviews};
CREATE TABLE IF NOT EXISTS ${characteristic_reviews} (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  value INTEGER NOT NULL
);`;

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

const alterTable = `
ALTER TABLE ${characteristic_reviews}
DROP COLUMN id,
ADD COLUMN id SERIAL PRIMARY KEY;
DROP INDEX IF EXISTS characteristic_reviews_index;
CREATE INDEX IF NOT EXISTS characteristic_reviews_index ON ${characteristic_reviews}(review_id);
DROP INDEX IF EXISTS characteristic_product_index;
CREATE INDEX IF NOT EXISTS characteristic_product_index ON ${characteristic_reviews}(product_id);
`;

stream.on('finish', () => {
  console.log(`Completed loading data into ${characteristic_reviews}`);
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