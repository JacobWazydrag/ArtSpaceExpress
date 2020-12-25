const express = require('express');
const router = express.Router();


const { create, read, serviceById, remove, update } = require('../controllers/services');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');
const { userById } = require('../controllers/user');

//when user hits the route, will hit validator first then signup controller
router.post('/services/create/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/services/:serviceId', read)
router.delete('/services/:serviceId/:userId', requireSignin, isAuth, isAdmin, remove)
router.put('/services/:serviceId/:userId', requireSignin, isAuth, isAdmin, update)

router.param('userId', userById);
router.param('serviceId', serviceById);


module.exports = router;
