const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    title: String,
    description: String,
    videoUrl: String,
});

videoSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
}
)

module.exports = mongoose.model('Video', videoSchema);

