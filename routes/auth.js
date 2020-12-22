const express = require('express');
const router = express.Router();

const { signup, signin, signout, requireSignin } = require('../controllers/auth');
const { userSignupValidator } = require('../validator/index');

//when user hits the route, will hit validator first then signup controller
router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

module.exports = router;
