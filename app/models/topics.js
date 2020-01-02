const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const topicsSchema = new Schema({
    __v: {type: Number, select: false},
    name: {type: String, required: true},//名称
    avatar_url: {type: String},
    introduction: {type: String,select:false},//简介
});

module.exports = model('Topics', topicsSchema);