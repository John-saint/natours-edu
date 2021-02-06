const express = require('express');
const {
  getAllReviews,
  getReview,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
} = require('./../controller/reviewController');
const { protect, restrictTo } = require('./../controller/authController');

const router = express.Router({ mergeParams: true });
/* (158) by default, each router only have access to the 
parameters of their specific routes. But here, in this 
route, so in this URL for this post, there's of course 
actually no tour id. */

router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('admin', 'user'), updateReview)
  .delete(restrictTo('admin', 'user'), deleteReview);

module.exports = router;
