const { khmerfoodSchema, tbalkhmerSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Khmerfood = require('./models/khmerfood');
const Tbalkhmer = require('./models/tbalkhmer');
const Review = require('./models/review');
const e = require('connect-flash');
const tbalkhmer = require('./models/tbalkhmer');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateKhmerfood = (req, res, next) => {
    const { error } = khmerfoodSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }


}
module.exports.validateTbalkhmer = (req, res, next) => {
    const { error } = tbalkhmerSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }

}




module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const khmerfood = await Khmerfood.findById(id);
    if (!khmerfood.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/khmerfoods/${id}`);
    } 
    next();
}
module.exports.isTbalAuthor = async (req, res, next) => {
    const { id } = req.params;
    const tbalkhmer = await Tbalkhmer.findById(id);
    if (!tbalkhmer.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/tbalkhmers/${id}`);
    }
    next();
}




module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/khmerfoods/${id}`);
    } 
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// module.exports.isAdminkhmerfood = async (req, res, next) => {
//     const { id } = req.params;
//     const khmerfood = await Khmerfood.findById(id);
//     if (!khmerfood.admin.equals(req.user._id)) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect(`/khmerfoods/${id}`);
//     }
//     next();
// }

module.exports.isAdminkhmerfood = async (req, res, next) => {
    if(req.user.id !== '652463cce658bebe7040a883'){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/khmerfoods`);
    }
}