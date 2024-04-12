const mongoose = require('mongoose');
const { Schema } = mongoose;

const BooksSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    uploadedby: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    genre: {
        type: String,
        require: true
    },
    coverlink: {
        type: String,
        require: true
    },
    pdflink: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});
const BookModel = mongoose.model('books', BooksSchema);
module.exports = BookModel
