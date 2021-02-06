const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  // checkID
  getToursWithin,
  getDistances,
  // tourImages
  uploadTourImages,
  resizeTourImages,
} = require('./../controller/tourController');
const { protect, restrictTo } = require('./../controller/authController');

const reviewRouter = require('./reviewRoutes');
// const { rules } = require('eslint-config-prettier');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);
/* (158) cause router is just a middleware, so we can use the 
'use' method on it, and 
then say that for this specific route here, we want to use 
the reviewRouter itself. 
Actually, this means "MOUNTING A ROUTER". */

// router.param('id', checkID);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

// router.route('/').get(protect);

// Geospacial query, to allow lookup for specific point on map within a point (nearby point)
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
