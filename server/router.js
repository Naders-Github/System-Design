const router = require('express').Router();
const controllers = require('./controllers.js');

router
  .route('/reviews/:id')
  .get(controllers.getAllReviews)
  .post(controllers.postReviews)

router
  .route('/characteristics')
  .get(controllers.getCharacteristics)

router
  .route('/reviews/helpful/:review_id')
  .put(controllers.updateHelpfulness)

router
  .route('/reviews/report/:review_id')
  .put(controllers.updateReport)

module.exports = router;