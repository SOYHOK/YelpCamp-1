const express = require('express');
const router = express.Router();
const tbalkhmers = require('../controllers/tbalkhmers');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isTbalAuthor, validateTbalkhmer } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });



const Tbalkhmer = require('../models/tbalkhmer');

router.route('/')
    .get(isLoggedIn, catchAsync(tbalkhmers.index))
    .post(isLoggedIn, upload.array('images'), validateTbalkhmer, catchAsync(tbalkhmers.createTbalkhmer))


router.get('/new', isLoggedIn,  tbalkhmers.renderNewForm)

router.route('/:id')
    .get(isLoggedIn, catchAsync(tbalkhmers.showTbalkhmer))
    .put(isLoggedIn, isTbalAuthor, upload.array('images'),validateTbalkhmer, catchAsync(tbalkhmers.updateTbalkhmer))
    .delete(isLoggedIn, isTbalAuthor, catchAsync(tbalkhmers.deleteTbalkhmer));

router.get('/:id/edit', isLoggedIn, isTbalAuthor, catchAsync(tbalkhmers.renderEditForm))



module.exports = router;
