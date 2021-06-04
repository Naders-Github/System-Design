const client = require('../../database/index.js');

const questionControllers = {
  getQuestions: (req, res) => {
    const { product_id } = req.params;
    const queryString = `SELECT * FROM questions LIMIT 100`;

    client.query(queryString, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(results.rows);
      }
    })
  },
  postQuestion: (req, res) => {
    const queryString = `
      INSERT INTO questions (product_id, body, date, name, email, reported, helpfulness)
      VALUES ($1, $2, current_timestamp, $3, $4, false, 0)`;

    const args = [req.body.product_id, req.body.body, req.body.name, req.body.email];

    client.query(queryString, args, (err, results) => {
      if (err) res.status(400).send(err);
      res.status(200).send(results);
    });
  },
reportQuestion: (req, res) => {
    const queryString = `
    UPDATE questions SET reported=true
    WHERE product_id=${req.params.product_id}`;

    client.query(queryString, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },
  updateQuestion: (req, res) => {
    const { product_id } = req.params;
    const queryString = `
    UPDATE questions SET helpfulness = helpfulness + 1
    WHERE product_id=${product_id}`;

    client.query(queryString, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(results.command);
      }
    });
  }
};

module.exports = questionControllers;