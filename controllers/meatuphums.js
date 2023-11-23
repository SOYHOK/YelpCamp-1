const Meatuphum = require('../models/meatuphum');
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const meatuphums = await Meatuphum.find({}).populate('popupText');
    res.render('meatuphums/index', { meatuphums })
}

module.exports.renderNewForm = (req, res) => {
    res.render('meatuphums/new');
}

module.exports.createMeatuphum = async (req, res, next) => {
    const meatuphum = new Meatuphum(req.body.meatuphum);
    meatuphum.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    meatuphum.author = req.user._id;
    await meatuphum.save();
    console.log(meatuphum);
    req.flash('success', 'Successfully made a new Meatuphum!');
    res.redirect(`/meatuphums/${meatuphum._id}`)
}

module.exports.showMeatuphum = async (req, res,) => {
    const meatuphum = await Meatuphum.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!meatuphum) {
        req.flash('error', 'Cannot find that Meatuphum!');
        return res.redirect('/meatuphums');
    }
    res.render('meatuphums/show', { meatuphum });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const meatuphum = await Meatuphum.findById(id)
    if (!meatuphum) {
        req.flash('error', 'Cannot find that meatuphum!');
        return res.redirect('/meatuphums');
    }
    res.render('meatuphums/edit', { meatuphum });
}

module.exports.updateMeatuphum = async (req, res) => {

    const { id } = req.params;
    console.log(req.body);
    const meatuphum = await Meatuphum.findByIdAndUpdate(id, { ...req.body.meatuphum });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    meatuphum.images.push(...imgs);
    await meatuphum.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await meatuphum.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated Meatuphum!');
    res.redirect(`/meatuphums/${meatuphum._id}`)
}

module.exports.deleteMeatuphum = async (req, res) => {
    const { id } = req.params;
    await Meatuphum.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Meatuphum')
    res.redirect('/meatuphums');
}


