const router = require('express').Router();
const controllers = require('./controllers.js');

router
  .route('/reviews/:id')
  .get(controllers.reviews.getAllReviews)
  .post(controllers.reviews.postReviews)

router
  .route('/characteristics')
  .get(controllers.reviews.getCharacteristics)

router
  .route('/reviews/helpful/:review_id')
  .put(controllers.reviews.updateHelpfulness)

router
  .route('/reviews/report/:review_id')
  .put(controllers.reviews.updateReport)

router
  .route('/products')
  .get(controllers.products.getProducts)

router
  .route('/products/:id')
  .get(controllers.products.getProductById)

router
  .route('/products/:product_id/styles')
  .get(controllers.products.getProductStyles)

module.exports = router;