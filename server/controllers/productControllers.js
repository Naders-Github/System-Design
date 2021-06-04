const client = require('../../database/index.js');

const productControllers = {
  getProducts: (req, res) => {
    let limit = req.query.count || 100;
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
    const queryString = `
      SELECT * FROM products
      INNER JOIN features ON products.id = features.product_id
      WHERE product_id=${req.params.product_id}`;

    client.query(queryString, (err, results) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(results.rows[0]);
      }
    });
  },

  getProductStyles: (req, res) => {
    const queryString = `
      SELECT * FROM styles
      INNER JOIN features ON styles.product_id = features.product_id
      INNER JOIN product_photos ON styles.id = product_photos.style_id
      INNER JOIN skus ON styles.id = skus.style_id
      WHERE styles.product_id=${req.params.product_id}`;
    client.query(queryString)
      .then((results) => {
        res.status(200).send(results.rows[0]);
      })
      .catch((err) => {
        res.status(400).send(err);
      })
  },
};

module.exports = productControllers;