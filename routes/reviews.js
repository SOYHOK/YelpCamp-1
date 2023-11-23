const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor, isTbalReviewAuthor, isMeatuphumAuthor } = require('../middleware');
const Khmerfood = require('../models/khmerfood');
const Tbalkhmer = require('../models/tbalkhmer');
const Meatuphum = require('../models/meatuphum');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview, reviews.createTbalkhmerReview, reviews.createMeatuphumReview  ))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, isTbalReviewAuthor, isMeatuphumAuthor, catchAsync(reviews.deleteReview, reviews.deleteTbalkhmerReview, reviews.deleteMeatuphumReview))

module.exports = router;