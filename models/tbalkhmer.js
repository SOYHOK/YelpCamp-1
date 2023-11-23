const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;


// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

// const opts = { toJSON: { virtuals: true } }; // this is for virtuals to work with res.json

const TbalkhmerSchema = new Schema({
    title: String,
    images: {
        type: [ImageSchema],
        unique: true
    },
    price: Number,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        id: '652463cce658bebe7040a883'
       
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    
}, );


// TbalkhmerSchema.virtual('properties.popUpMarkup').get(function () {
//     return `
//     <strong><a href="/Tbalkhmers/${this._id}">${this.title}</a><strong>
//     <p>${this.description.substring(0, 20)}...</p>`
// });



TbalkhmerSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Tbalkhmer', TbalkhmerSchema);