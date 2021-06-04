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

const reviews_photos = 'reviews_photos';
const filePath = path.join(__dirname, '../../csvFiles/reviews/reviews_photos.csv');

const createTable = `
DROP TABLE IF EXISTS ${reviews_photos};
CREATE TABLE IF NOT EXISTS ${reviews_photos} (
  id SERIAL PRIMARY KEY,
  reviews_id INT NOT NULL,
  url TEXT
);`;

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

const alterTable = `
ALTER TABLE ${reviews_photos}
DROP COLUMN id,
ADD COLUMN id SERIAL PRIMARY KEY;
DROP INDEX IF EXISTS reviews_photos_index;
CREATE INDEX IF NOT EXISTS reviews_photos_index ON ${reviews_photos}(reviews_id);
`;

stream.on('finish', () => {
  console.log(`Completed loading data into ${reviews_photos}`);
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