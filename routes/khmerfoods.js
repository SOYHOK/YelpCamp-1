const express = require('express');
const router = express.Router();
const khmerfoods = require('../controllers/khmerfoods');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateKhmerfood } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });



const Khmerfood = require('../models/khmerfood');

router.route('/')
    .get(isLoggedIn, catchAsync(khmerfoods.index))
    .post(isLoggedIn, upload.array('images'), validateKhmerfood, catchAsync(khmerfoods.createKhmerfood))


router.get('/new', isLoggedIn,  khmerfoods.renderNewForm)

router.route('/:id')
    .get(isLoggedIn, catchAsync(khmerfoods.showKhmerfood))
    .put(isLoggedIn, isAuthor, upload.array('images'), validateKhmerfood, catchAsync(khmerfoods.updateKhmerfood))
    .delete(isLoggedIn, isAuthor, catchAsync(khmerfoods.deleteKhmerfood));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(khmerfoods.renderEditForm))



module.exports = router;