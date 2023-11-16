const Khmerfood = require('../models/khmerfood');
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
