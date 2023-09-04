const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const questionSchema = new Schema({
    __v: {type: Number, select: false},
    title: {type: String, required: true},//名称
    description: {type: String},
    topics: {type: String},
    questioner: {type: Schema.Types.ObjectId,ref:'User', required: true,select:false},//提问用户
    topics: {type: [{type:Schema.Types.ObjectId,ref:'Topic'}],select:false},//话题
});
module.exports = model('Question', questionSchema);