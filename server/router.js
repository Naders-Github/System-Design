const router = require('express').Router();
const productControllers = require('./controllers/productControllers.js');
const reviewControllers = require('./controllers/reviewControllers.js');
const questionControllers = require('./controllers/questionControllers.js');
const answerControllers = require('./controllers/answerControllers.js');

/* ------------------REVIEWS---------------------------- */

router
  .route('/reviews')
  .get(reviewControllers.getAllReviews)
  .post(reviewControllers.postReviews)

router
  .route('/characteristics')
  .get(reviewControllers.getCharacteristics)

router
  .route('/reviews/helpful/:id')
  .put(reviewControllers.updateHelpfulness)

router
  .route('/reviews/report/:id')
  .put(reviewControllers.updateReport)

/* ------------------PRODUCT DETAIL--------------------- */

router
  .route('/products')
  .get(productControllers.getProducts)

router
  .route('/products/:product_id')
  .get(productControllers.getProductById)

router
  .route('/products/:product_id/styles')
  .get(productControllers.getProductStyles)

/* ------------------QUESTIONS-------------------------- */

router
  .route('/questions')
  .get(questionControllers.getQuestions)
  .post(questionControllers.postQuestion)

router
  .route('/questions/helpful/:product_id')
  .put(questionControllers.updateQuestion)

router
  .route('/questions/report/:product_id')
  .put(questionControllers.reportQuestion)

/* ------------------ANSWERS---------------------------- */

router
  .route('/answers')
  .get(answerControllers.getAnswers)
  .post(answerControllers.postAnswer)

router
  .route('/answers/report/:question_id')
  .put(answerControllers.reportAnswer)


router
  .route('/answers/helpful/:question_id')
  .put(answerControllers.updateAnswer)

module.exports = router;