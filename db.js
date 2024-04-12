const mongoose = require('mongoose');
const { MOGOURL } = require('./config/keys')

const connectToMongo = () => {
    mongoose.connect(MOGOURL)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB', error);
        });
}


module.exports = connectToMongo;