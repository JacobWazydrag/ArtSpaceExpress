const express = require('express');
const router = express.Router();
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');
const { create } = require('../controllers/category');
const { userById } = require('../controllers/user');

//when user hits the route, will hit validator first then signup controller
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);

router.param('userId', userById);

module.exports = router;
