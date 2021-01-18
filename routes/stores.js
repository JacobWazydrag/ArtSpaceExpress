const express = require('express');
const router = express.Router();

const {
    create,
    read,
    storeById,
    remove,
    update,
    list,
    listBySearch,
    img
} = require('../controllers/stores');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');
const { userById } = require('../controllers/user');


router.post('/stores/create/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/stores/:storeId', read);
router.delete('/stores/:storeId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/stores/:storeId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/stores', list);
router.post("/stores/by/search", listBySearch);
router.get('/stores/img/:storeId', img)

router.param('userId', userById);
router.param('storeId', storeById);

module.exports = router;
