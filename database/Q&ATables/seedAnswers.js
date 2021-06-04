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
  password: config.TOKEN,
  port: 5432,
});

client.connect((err) => err ? console.error(err) : console.log('Database Success'));

const filePath = path.join(__dirname, '../../csvFiles/QnA/answers.csv');
const answers = 'answers';

const createTable = `
DROP TABLE IF EXISTS ${answers};
CREATE TABLE IF NOT EXISTS ${answers} (
  id SERIAL PRIMARY KEY,
  question_id INT NOT NULL,
  body VARCHAR(1000) NOT NULL,
  date TIMESTAMP NOT NULL,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL,
  reported BOOLEAN DEFAULT false,
  helpfulness INTEGER NOT NULL
);`;

client.query(createTable).then((res) => {
  console.log('Table successfully created!!!')
});

const stream = client.query(copyFrom(`COPY ${answers} FROM STDIN DELIMITER ',' CSV HEADER;`));
const fileStream = fs.createReadStream(filePath);

console.time('Execution Time');

fileStream.on('error', (error) =>{
  console.log(`Error in reading file: ${error}`)
})
stream.on('error', (error) => {
  console.log(`Error in copy command: ${error}`)
})

const alterTable = `
ALTER TABLE ${answers}
DROP COLUMN id,
ADD COLUMN id SERIAL PRIMARY KEY;
DROP INDEX IF EXISTS answers_idx;
CREATE INDEX IF NOT EXISTS answers_idx ON ${answers} (question_id);`;

stream.on('finish', () => {
    console.log(`Completed loading data into ${answers} `);
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