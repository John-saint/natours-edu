/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51IEnYbAee10ofx4wFOTp82ZqIih20Q5xmAP0PxnP0xzi7cWKTDHwXNXdeYvDKmntYBX5gPNnX0SwTlQPYD61TDr5004cpNTDLw'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Create checkout form + charge the credit card
    await stripe.redirectToCheckout({
      // coming from session, remember how the session was inside of the data, so there was a data object created by axios, and a response (session.id)
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
