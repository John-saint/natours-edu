const Review = require('./../models/reviewModel');
const handleFactory = require('./handlerFactory');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {}; // If it is all regular API call without nested route, well then that filter will simply be this empty object, and so then we're gonna find all the reviews.
//   if (req.params.tourId) filter = { tour: req.params.tourId };

//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = handleFactory.getAll(Review);
exports.getReview = handleFactory.getOne(Review);
exports.createReview = handleFactory.createOne(Review);
exports.updateReview = handleFactory.updateOne(Review);
exports.deleteReview = handleFactory.deleteOne(Review);
