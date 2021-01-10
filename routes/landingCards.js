const express = require('express');
const router = express.Router();

const { create, list, landingCardById, update, remove, img } = require('../controllers/landingCards');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.post('/landing-cards/create/:userId', requireSignin, isAuth, isAdmin, create);
router.put('/landing-cards/:landingCardId/:userId', requireSignin, isAuth, isAdmin, update);
router.delete('/landing-cards/:landingCardId/:userId', requireSignin, isAuth, isAdmin, remove);
router.get('/landing-cards', list);
router.get("/landing-cards/img/:landingCardId", img);


router.param('landingCardId', landingCardById);
router.param('userId', userById);

module.exports = router;