const express = require('express');
const router = express.Router();

const {
    create,
    read,
    serviceById,
    remove,
    update,
    list,
    listRelated,
    listCategories,
    listBySearch,
    img
} = require('../controllers/services');
const { requireSignin, isAdmin, isAuth } = require('../controllers/auth');
const { userById } = require('../controllers/user');

//when user hits the route, will hit validator first then signup controller
router.post('/services/create/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/services/:serviceId', read);
router.delete('/services/:serviceId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/services/:serviceId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/services', list);
router.get('/services/related/:serviceId', listRelated);
router.get('/service/categories', listCategories);
router.post("/services/by/search", listBySearch);
router.get('/services/img/:serviceId', img)

router.param('userId', userById);
router.param('serviceId', serviceById);

module.exports = router;
