const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
  // 199 Configuring Multer
  uploadUserPhoto,
  resizeUserPhoto,
} = require('./../controller/userController');
const {
  protect,
  restrictTo,
  updatePassword,
  forgotPassword,
  resetPassword,
  login,
  signup,
  logout,
} = require('./../controller/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
// Multer is a very popular middleware to handle multipart form data (form encoding, which used to upload files from a form)

// Starting here, you always have to be authenticated
router.use(protect);

router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteMe', deleteMe);

router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
