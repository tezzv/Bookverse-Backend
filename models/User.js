const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    balance: {
        type: Number,
        default: 0
    },
    seller: {
        type: Boolean,
        default: false
    }
});

// module.exports = mongoose.Model('user', UserSchema)
const UserModel = mongoose.model('user', UserSchema)
// UserModel.createIndexes();
module.exports = UserModel