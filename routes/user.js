const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin, isGM } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.get('/secret/:userId', requireSignin, isAuth, isGM, (req, res) => {
    res.json({
        user: req.profile
    });
});

router.param('userId', userById);

module.exports = router;
