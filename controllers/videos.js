const Video = require('../models/video');
const { cloudinary } = require("../cloudinary");
const { model } = require('mongoose');

module.exports.index = async (req, res) => {
    const videos = await Video.find({}).populate('popupText');
    res.render('videos/index', { videos })
}

module.exports.renderNewForm = (req, res) => {
    res.render('videos/new');
}

module.exports.createVideo = async (req, res, next) => {
    const video = new Video(req.body.video);
    video.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    video.author = req.user._id;
    await video.save();
    console.log(video);
    req.flash('success', 'Successfully made a new video!');
    res.redirect(`/videos/${video._id}`)
}

module.exports.showVideo = async (req, res,) => {
    const video = await Video.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!video) {
        req.flash('error', 'Cannot find that video!');
        return res.redirect('/videos');
    }
    res.render('videos/show', { video });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id)
    if (!video) {
        req.flash('error', 'Cannot find that video!');
        return res.redirect('/videos');
    }
    res.render('videos/edit', { video });
}

module.exports.updateVideo = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const video = await Video.findByIdAndUpdate(id, { ...req.body.video });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    video.images.push(...imgs);
    await video.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await video.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated video!');
    res.redirect(`/videos/${video._id}`)
}

module.exports.deleteVideo = async (req, res) => {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted video')
    res.redirect('/videos');
}


