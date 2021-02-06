// review / rating / createdAt / ref to Tour / ref to User
const mongoose = require('mongoose');
const validator = require('validator');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    // just to make sure when we have a virtual property, a field that is not stored in the database but calculated using some other value, we want this to also show up whenever there is an output.
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true }); // (169)Each combination of tour and user has always to be unique. This making of a Unique compound index is to ensure that when user cannot write multiple reviews for the tour.

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name photo',
  });

  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// (167) STATIC METHOD of Mongoose is used for the first time
//

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // (167)to do the calculation, we need to use aggregation pipeline (in the tourController)
  const stats = await this.aggregate([
    // (167)in aggregate we need to pass in an array of all the stages that we want in aggregate
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        // (167) this actually returns a promise, so we need to await and store it in variable
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5, // 4.5 when there are no reviews at all
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  /* We need somethinh like this.constructor
  to make a call to the calcAveratgeRatings function below,
  because calcAverageRatings function is a static method, and so
  we need to call it to the model (this(equivalent for the post method before).r.constructor)
  */
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
