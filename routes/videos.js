const express = require('express');
const router = express.Router();
const videos = require('../controllers/videos');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateKhmerfood } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Video = require('../models/video');

router.route('/')
    .get(isLoggedIn, catchAsync(videos.index))
    .post(isLoggedIn, upload.single('images'), validateKhmerfood, catchAsync(videos.createVideo))

router.get('/new', isLoggedIn, videos.renderNewForm)

router.route('/:id')
    .get(isLoggedIn, catchAsync(videos.showVideo))
    .put(isLoggedIn, isAuthor, upload.single('images'), validateKhmerfood, catchAsync(videos.updateVideo))
    .delete(isLoggedIn, isAuthor, catchAsync(videos.deleteVideo));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(videos.renderEditForm))

module.exports = router;

