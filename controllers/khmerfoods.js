const Khmerfood = require('../models/khmerfood');
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const khmerfoods = await Khmerfood.find({}).populate('popupText');
    res.render('khmerfoods/index', { khmerfoods })
}

module.exports.renderNewForm = (req, res) => {
    res.render('khmerfoods/new');
}

module.exports.createKhmerfood = async (req, res, next) => {
    const khmerfood = new Khmerfood(req.body.khmerfood);
    khmerfood.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    khmerfood.author = req.user._id;
    await khmerfood.save();
    console.log(khmerfood);
    req.flash('success', 'Successfully made a new khmerfood!');
    res.redirect(`/khmerfoods/${khmerfood._id}`)
}

module.exports.showKhmerfood = async (req, res,) => {
    const khmerfood = await Khmerfood.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!khmerfood) {
        req.flash('error', 'Cannot find that khmerfood!');
        return res.redirect('/khmerfoods');
    }
    res.render('khmerfoods/show', { khmerfood });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const khmerfood = await Khmerfood.findById(id)
    if (!khmerfood) {
        req.flash('error', 'Cannot find that khmerfood!');
        return res.redirect('/khmerfoods');
    }
    res.render('khmerfoods/edit', { khmerfood });
}

module.exports.updateKhmerfood = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const khmerfood = await Khmerfood.findByIdAndUpdate(id, { ...req.body.khmerfood });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    khmerfood.images.push(...imgs);
    await khmerfood.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await khmerfood.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated khmerfood!');
    res.redirect(`/khmerfoods/${khmerfood._id}`)
}

module.exports.deleteKhmerfood = async (req, res) => {
    const { id } = req.params;
    await Khmerfood.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted khmerfood')
    res.redirect('/khmerfoods');
}