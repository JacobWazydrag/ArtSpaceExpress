const express = require('express');
const router = express.Router();

const { signup, signin } = require('../controllers/user')
const { userSignupValidator } = require('../validator/index');

//when user hits the route, will hit validator first then signup controller
router.post('/signup', userSignupValidator, signup);
router.post('/sigin', signin);

module.exports = router;