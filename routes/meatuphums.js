const express = require('express');
const router = express.Router();
const meatuphums = require('../controllers/meatuphums');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isMeatuphumAuthor, validateMeatuphum } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });



const Meatuphum = require('../models/meatuphum');

router.route('/')
    // .get( catchAsync(meatuphums.index))
    .get(isLoggedIn, catchAsync(meatuphums.index))
    .post(isLoggedIn, upload.array('images'), validateMeatuphum, catchAsync(meatuphums.createMeatuphum))


router.get('/new', isLoggedIn,  meatuphums.renderNewForm)

router.route('/:id')
    .get(isLoggedIn, catchAsync(meatuphums.showMeatuphum))
    .put(isLoggedIn, isMeatuphumAuthor, upload.array('images'), validateMeatuphum, catchAsync(meatuphums.updateMeatuphum))
    .delete(isLoggedIn, isMeatuphumAuthor, catchAsync(meatuphums.deleteMeatuphum));

router.get('/:id/edit', isLoggedIn, isMeatuphumAuthor, catchAsync(meatuphums.renderEditForm))



module.exports = router;
