const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin, isGM, isManager } = require('../controllers/auth');
const { artistById, read, update } = require('../controllers/artist');

router.get('/secret/artist/:artistId', requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        artist: req.profile
    });
});

router.get('/artist/:artistId', requireSignin, isAuth, read);
router.put('/artist/:artistId', requireSignin, isAuth, update);

router.param('artistId', artistById);

module.exports = router;
