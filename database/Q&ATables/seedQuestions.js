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

const filePath = path.join(__dirname, '../../csvFiles/QnA/questions.csv');
const questions = 'questions';

const createTable = `
DROP TABLE IF EXISTS ${questions};
CREATE TABLE IF NOT EXISTS ${questions} (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  reported BOOLEAN DEFAULT false,
  helpfulness INTEGER NOT NULL
);`;

client.query(createTable).then((res) => {
  console.log('Table successfully created!!!')
});

const stream = client.query(copyFrom(`COPY ${questions} FROM STDIN DELIMITER ',' CSV HEADER;`));
const fileStream = fs.createReadStream(filePath);

console.time('Execution Time');

fileStream.on('error', (error) =>{
  console.log(`Error in reading file: ${error}`);
})
stream.on('error', (error) => {
  console.log(`Error in copy command: ${error}`);
})

const alterTable = `
ALTER TABLE ${questions}
DROP COLUMN id,
ADD COLUMN id SERIAL PRIMARY KEY;
DROP INDEX IF EXISTS questions_index;
CREATE INDEX IF NOT EXISTS questions_index ON ${questions}(product_id)
`

stream.on('finish', () => {
  console.log(`Completed loading data into ${questions}`);
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