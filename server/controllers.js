const db = require('../database/index.js')

const controllers = {
  getAllReviews: (req, res) => {
    const queryString = `SELECT *
                         FROM reviews
                         INNER JOIN photos
                         ON reviews.id=photos.review_id
                         WHERE product_id=${req.params.id}`;
    db.query(queryString, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(results.rows);
      }
    });
  },

  getMetaReviews: (req, res) => {
    const queryString = `SELECT *
                         FROM characteristics
                         INNER JOIN metadata
                         ON characteristics.product_id = metadata.product_id
                         WHERE review_id=${req.params.id}`;
    db.query(queryString, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  postReviews: (req, res) => {
    let { rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness } = req.body;
    const selectQuery = `SELECT pg_catalog.setval(pg_get_serial_sequence('reviews', 'id'), MAX(id)) FROM reviews`;
    const insertQuery = `INSERT INTO reviews (rating, summary, body, recommend, reported,
                                              reviewer_name, reviewer_email, response, helpfulness)
                         VALUES (${rating}, '${summary}', '${body}', ${recommend}, ${reported},
                         '${reviewer_name}', '${reviewer_email}', '${response}', ${helpfulness})`;
    db.query(selectQuery, (err, results) => {
      if (err) res.status(400).send(err);
      db.query(insertQuery, (err, results) => {
        if (err) res.status(400).send(err);
        res.status(200).send(results);
      });
    });
  },

  updateHelpfulness: (req, res) => {
    const queryString = `UPDATE reviews
                         SET helpfulness = ${req.body.helpfulness}
                         WHERE id=${req.params.review_id}`
    db.query(queryString, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  updateReport: (req, res) => {
    const queryString = `UPDATE reviews
                         SET reported = ${req.body.reported}
                         WHERE id=${req.params.review_id}`
    db.query(queryString, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  }
}

module.exports = controllers;
