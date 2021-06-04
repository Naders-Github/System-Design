const client = require('../../database/index.js');

const answerControllers = {
  getAnswers: (req, res) => {
    const count = req.query.count || 100;
    const page = req.query.page || 1;
    const offSet = count * page - count;

    const queryString = `
      SELECT * FROM answers
      ORDER BY helpfulness
      DESC LIMIT '${count}' OFFSET '${offSet}'`;

    client.query(queryString, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(results.rows);
      }
    })
  },
postAnswer: (req, res) => {
    const queryString = `
      INSERT INTO answers (question_id, body, date, name, email, reported, helpfulness)
      VALUES ($1, $2, current_timestamp, $3, $4, false, 0)`;

    const args = [req.body.question_id, req.body.body, req.body.name, req.body.email];

    client.query(queryString, args, (err, results) => {
      if (err) res.status(400).send(err);
      res.status(200).send(results);
    });
  },
  reportAnswer: (req, res) => {
    const queryString = `
    UPDATE answers SET reported = true
    WHERE id=${req.params.question_id}`;

    client.query(queryString, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(results);
      }
    })
  },
updateAnswer: (req, res) => {
    const {question_id } = req.params;
    const queryString = `
    UPDATE answers SET helpfulness = helpfulness + 1
    WHERE question_id=${question_id}`;

    client.query(queryString, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(results.command);
      }
    });
  },
};

module.exports = answerControllers;