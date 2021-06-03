const client = require('../database/index.js');

const controllers = {

  reviews: {

    getAllReviews: (req, res) => {
      const queryString = `SELECT *
                           FROM reviews
                           INNER JOIN reviews_photos
                           ON reviews.id=reviews_photos.reviews_id
                           WHERE product_id=${req.params.id}`;
      client.query(queryString, (err, results) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(results.rows);
        }
      });
    },

    getCharacteristics: (req, res) => {
      const queryString = `SELECT *
                           FROM characteristics
                           INNER JOIN characteristic_reviews
                           ON characteristics.product_id = characteristic_reviews.product_id
                           LIMIT 5`;
      client.query(queryString, (err, results) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(results.rows);
        }
      });
    },

    postReviews: (req, res) => {
      let { rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness } = req.body;
      const selectQuery = `SELECT pg_catalog.setval(pg_get_serial_sequence('reviews', 'id'), MAX(id)) FROM reviews`;
      const insertQuery = `INSERT INTO reviews (rating, summary, body, recommend, reported,
                                                reviewer_name, reviewer_email, response, helpfulness)
                           VALUES ($1, '$2', '$3', $4, $5, '$6', '$7', '$8', $9)
                           WHERE product_id=${req.params.id})`;
      client.query(selectQuery, (err, results) => {
        if (err) res.status(400).send(err);
        client.query(insertQuery, (err, results) => {
          if (err) res.status(400).send(err);
          res.status(200).send(results);
        });
      });
    },

    updateHelpfulness: (req, res) => {
      const queryString = `UPDATE reviews
                           SET helpfulness = ${req.body.helpfulness}
                           WHERE id=${req.params.review_id}`
      client.query(queryString, (err, results) => {
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
      client.query(queryString, (err, results) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(results);
        }
      });
    },
  },

  products: {

    getProducts: (req, res) => {
      let limit = req.query.count || 10;
      let page = req.query.page || 1;
      let offSet = limit * page - limit;
      const queryString = `SELECT * FROM products LIMIT ${limit} OFFSET ${offSet}`;
      client.query(queryString, (err, results) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(results.rows);
        }
      });
    },

    getProductById: (req, res) => {
      let { id } = req.params;
      const queryString = `SELECT * FROM products
                           INNER JOIN features
                           ON products.id=features.product_id
                           WHERE product_id=${id}`;
      client.query(queryString, (err, results) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(results.rows[0]);
        }
      });
    },

    getProductStyles: (req, res) => {
      let { product_id } = req.params;
      client.query(`SELECT * from styles WHERE product_id = ${product_id}`, (err, results) => {
        if (err) res.send(err);
        let styles = results.rows;
        styles.forEach((item, ind) => {
          item.photos = [];
          client.query(`SELECT url, thumbnail_url from photos WHERE style_id = ${item.id}`, (err, photoResult) => {
            if (err) console.log(err)
            item.photos = item.photos.concat(photoResult.rows);
            if (ind === styles.length -1) {
              res.send(styles);
            }
          });
        });
      });
    },
  }
};

  module.exports = controllers;
