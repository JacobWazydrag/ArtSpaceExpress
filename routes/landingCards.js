const express = require('express');
const router = express.Router();

const { create } = require('../controllers/landingCards');
// const { create, landingCardById, read, update, remove, list} = require('../controllers/landingCards');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

// router.get('/landing-cards/:landingCardId', read);
router.post('/landing-cards/create/:userId', requireSignin, isAuth, isAdmin, create);
// router.put('/landing-cards/:landingCardId/:userId', requireSignin, isAuth, isAdmin, update);
// router.delete('/landing-cards/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove);
// router.get('/landing-cards', list);


// router.param('landingCardId', landingCardById);
router.param('userId', userById);

module.exports = router;