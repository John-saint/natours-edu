const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  //  1) Get tour data from collection
  const tours = await Tour.find();

  //  2) Build template together with the instructor
  //  3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (req.user) {
    // isBooked to see if hte user is already booked for the tours
    const isBooked = await Booking.find({ user: req.user.id, tour: tour.id });
    // for getting the date for the tour of the user
    const tourDate = isBooked.date;
  } else {
    // [ADDITIONAL FOR PURPOSES] to avoid bug in production env, so if thre is no logged in user, the value of the booked tour will be zero and the date will be today
    isBooked = 0;
    tourDate = Date.now();
  }

  if (!tour) {
    return next(new AppError('There is no tour with that name, bby :)', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    isBooked,
    tourDate,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login to your account',
  });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up now to get access to book the tour!',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  // (216) Find a booking with the current tourID
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
  //
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  // console.log('UPDATING USER', req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    // (194) Otherwise, the template that the user is going to use comes from the protect middleware if we dont put 'user: updatedUser'
    user: updatedUser,
  });
});

// Set for content policy
// .set(
// for 211 https://*.stripe.com
// https://is.stripe.com/V3
// 'Content-Security-Policy',
// "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
// )
