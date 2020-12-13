const express = require('express');
const router = express.Router()

//all routes related to users

router.get('/', (req, res) => {
    res.send('hello from node user.js');
})

module.exports = router;