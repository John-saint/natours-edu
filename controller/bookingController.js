const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const handleFactory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // (213) this success_url is not secure at all
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        // All these fields come from Stripe, we can not make our own fields here
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // this is only TEMPORARY , because it's UNSECURE: everything can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  // redirect is basically to create a new request but to this new url
  // ${req.protocol}://${req.get('host')}
  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = handleFactory.createOne(Booking);
exports.getBooking = handleFactory.getOne(Booking);
exports.getAllBookings = handleFactory.getAll(Booking);
exports.updateBooking = handleFactory.updateOne(Booking);
exports.deleteBooking = handleFactory.deleteOne(Booking);
