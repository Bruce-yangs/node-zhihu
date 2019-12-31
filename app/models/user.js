const mongoose = require('mongoose');

const { Schema,model } = mongoose;

const userSchema = new Schema({
    __v:{type: Number,select:false},
    name: {type: String,required: true},
    password: {type: String,required: true,select:false},
    avatar_url: {type: String},//头像
    gender: {type: String,enum:['male','female'],default: 'male',required: true}, //enum 可枚举 性别
    headline:{type: String},//一句话介绍
    locations:{type: [{type: String}],select:false},//居住地
    business:{type: String,select:false},//行业
    employments:{//职业经历
        type: [ {
            company:{type: String},//公司
            job:{type: String},//职位
        }
    ],select:false},
    educations: {//教育经历
        type:[{
            school:{type: String},//学校
            major:{type: String},//专业
            diploma:{type: Number,enum:[1,2,3,4,5]},//学历
            entrance_year:{type: Number},//入学年份
            graduation_year:{type: Number}//毕业年份
        }],select:false
    }
});

module.exports = model('User',userSchema);