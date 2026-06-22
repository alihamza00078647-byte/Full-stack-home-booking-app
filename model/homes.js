const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
    homeSerialNum : {
        type : String,
        required : true
    },
    houseName : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    rating : {
        type : Number,
        required : true
    },
    mainImage : {
        type : String,
        required : true,
    },
    imgOne : String,
    imgTwo : String,
    imgThree : String,
    imgFour : String,
    description : {
        type : String,
        required : true
    }
});


module.exports = mongoose.model('Home', homeSchema);