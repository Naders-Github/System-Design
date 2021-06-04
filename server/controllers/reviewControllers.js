const client = require('../../database/index.js');

const reviewControllers = {
  getAllReviews: (req, res) => {
    let limit = req.query.count || 100;
    let page = req.query.page || 1;
    let offSet = limit * page - limit;

    const queryString = `
    SELECT *
    FROM reviews
    INNER JOIN reviews_photos
    ON reviews.id=reviews_photos.reviews_id
    LIMIT ${limit} OFFSET ${offSet}`;

    client.query(queryString, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(results.rows);
      }
    });
  },

  getCharacteristics: (req, res) => {
    let limit = req.query.count || 100;
    let page = req.query.page || 1;
    let offSet = limit * page - limit;

    const queryString = `
    SELECT *
    FROM characteristics
    INNER JOIN characteristic_reviews
    ON characteristics.product_id = characteristic_reviews.product_id
    LIMIT ${limit} OFFSET ${offSet}`;

    client.query(queryString, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(results.rows);
      }
    });
  },
  postReviews: (req, res) => {
    const selectQuery = `
    SELECT pg_catalog.setval(pg_get_serial_sequence('reviews', 'id'), MAX(id))
    FROM reviews`;
    const queryString = `
    INSERT INTO reviews (rating, summary, body, recommend, reported,
                         reviewer_name, reviewer_email, response, helpfulness)
    VALUES ($1, '$2', '$3', $4, $5, '$6', '$7', '$8', $9)
    WHERE product_id=${req.params.id})`;
    client.query(selectQuery, (err, results) => {
      if (err) res.status(400).send(err);
      client.query(queryString, (err, results) => {
        if (err) res.status(400).send(err);
        res.status(200).send(results);
      });
    });
  },
  updateHelpfulness: (req, res) => {
    const queryString = `
    UPDATE reviews
    SET helpfulness = helpfulness + 1
    WHERE id=${req.params.id}`;

    client.query(queryString, (err, results) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  },

  updateReport: (req, res) => {
    const queryString = `
    UPDATE reviews
    SET reported = true
    WHERE id=${req.params.id}`;

    client.query(queryString, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(results);
      }
    });
  }
};

module.exports = reviewControllers;