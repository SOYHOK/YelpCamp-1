const Tbalkhmer = require('../models/tbalkhmer');
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const tbalkhmers = await Tbalkhmer.find({}).populate('popupText');
    res.render('tbalkhmers/index', { tbalkhmers })
}

module.exports.renderNewForm = (req, res) => {
    res.render('tbalkhmers/new');
}

module.exports.createTbalkhmer = async (req, res) => {
    const tbalkhmer = new Tbalkhmer(req.body.tbalkhmer);
    tbalkhmer.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    tbalkhmer.author = req.user._id;
    await tbalkhmer.save();
    console.log(tbalkhmer);
    req.flash('success', 'Successfully made a new tbalkhmer!');
    res.redirect(`/tbalkhmers/${tbalkhmer._id}`)
}

module.exports.showTbalkhmer = async (req, res,) => {
    const tbalkhmer = await Tbalkhmer.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!tbalkhmer) {
        req.flash('error', 'Cannot find that tbalkhmer!');
        return res.redirect('/tbalkhmers');
    }
    res.render('tbalkhmers/show', { tbalkhmer });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const tbalkhmer = await Tbalkhmer.findById(id)
    if (!tbalkhmer) {
        req.flash('error', 'Cannot find that tbalkhmer!');
        return res.redirect('/tbalkhmers');
    }
    res.render('tbalkhmers/edit', { tbalkhmer });
}

module.exports.updateTbalkhmer = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const tbalkhmer = await Tbalkhmer.findByIdAndUpdate(id, { ...req.body.tbalkhmer });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    tbalkhmer.images.push(...imgs);
    await tbalkhmer.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await tbalkhmer.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated tbalkhmer!');
    res.redirect(`/tbalkhmers/${tbalkhmer._id}`)
}

module.exports.deleteTbalkhmer = async (req, res) => {
    const { id } = req.params;
    await Tbalkhmer.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted tbalkhmer')
    res.redirect('/tbalkhmers');
}


