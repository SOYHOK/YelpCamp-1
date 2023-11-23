const Khmerfood = require('../models/khmerfood');
const Tbalkhmer = require('../models/tbalkhmer');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const khmerfood = await Khmerfood.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    khmerfood.reviews.push(review);
    await review.save();
    await khmerfood.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/khmerfoods/${khmerfood._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Khmerfood.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/khmerfoods/${id}`);
}

module.exports.createTbalkhmerReview = async (req, res) => {
    const tbalkhmer = await Tbalkhmer.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    tbalkhmer.reviews.push(review);
    await review.save();
    await tbalkhmer.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/tbalkhmers/${tbalkhmer._id}`);
}

module.exports.deleteTbalkhmerReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Tbalkhmer.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/tbalkhmers/${id}`);
}