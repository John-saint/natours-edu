/* eslint-disable */
// index.js is to get data from the user interface and then delegate the action

import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signup } from './signup';
import { createReview } from './review';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

// ADDINTIONAL FOR REVIEWS
// const reviewBtn = document.querySelector('.btn--review');
// const reviewSave = documemt.querySelector('.review-save');
// const closeReview = document.querySelector('.close');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

// USER WANTS TO LOG IN
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // VALUES
    // We use the value property in order to reach the value out there
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

// CURRENT USER WANTS TO LOGOUT
if (logOutBtn) logOutBtn.addEventListener('click', logout);

// CURRENT USER WANTS TO UPDATE FORM
if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    updateSettings(form, 'data');
  });

// CURRENT USER WANTS TO CHANGE PASSWORD
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

// BOOK BUTTON
if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

// REVIEW BUTTON
// if (reviewBtn) {
//   reviewBtn.addEventLiistener('click', () => {
//     document.querySelector('.bg-modal').style.display = 'flex';
//   });
// }
// if (closeReview) {
//   closeReview.addEventListener('click', () => {
//     document.querySelector('.bg-modal').style.display = 'none';
//   });
// }
// if (reviewSave) {
//   reviewSave.addEventListener('click', async (e) => {
//     const review = document.getElementById('review').value;
//     const rating = document.getElementById('ratings').value;
//     const { tourId } = e.target.dataset;
//     await createReview(tourId, review, rating);
//     document.querySelector('.bg-modal').style.display = 'none';
//   });
// }
