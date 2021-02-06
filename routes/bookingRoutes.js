const express = require('express');
const bookingController = require('./../controller/bookingController');
const authController = require('./../controller/authController');
// const AppError = require('../utils/appError');

const router = express.Router({});

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;

// 1) Implement restriction that users can only review a tour thet they have actually booked;

// 2) Implement nested booking routes:
// /tours/:id/bookings
// /users/:id/bookings

// 3) Improve tour dates: add a 'participants' and a 'soldOut' field to each date. A date then becomes like an instance of the tour. Then, when a user books, they need to select one  of the dates. A new booking will increase the number of participants in the date, until it is booked out ('participants' > 'maxGroupSize'). So, when a user wants to book, you need to check ot if tour on the selected date is still available. If not

// 4) Implement advanced authentication features: confirm user email, keep users logged in with refresh tokens, two-factor authentication, etc.

// WEBSITE
// 1) Implement a sign up form
// 2) The tour detail page, if a user has taken a tour, allow them add a review directly on the website. Implement a form for this (and also when the time has already passed)
// 3) Hide the entire booking section on the tour detail page if current user has already booked the tour (also prevent duplicate bookings on the model);
// 4) Implement 'like tour' functionality, with favourite tour page; favourite panel for the logged user.
// 5) On the user account page, implement the "My Reviews" page, where all reviews are displayed, and a user can edit them. (If you know React, this would be an amazing way to use the Natours API and train your skills!)
// 6) For administrators, implement all the "manage" pages, where they can CRUD tours, users, reviews, and bookings.
