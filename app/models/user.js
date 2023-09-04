const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
  avatar_url: { type: String }, //头像
  gender: {
    type: String,
    enum: ["male", "female"],
    default: "male",
    required: true,
  }, //enum 可枚举 性别
  headline: { type: String }, //一句话介绍
  locations: {
    type: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
    select: false,
  }, //居住地
  business: { type: Schema.Types.ObjectId, ref: "Topic", select: false }, //行业
  employments: {
    //职业经历
    type: [
      {
        company: { type: Schema.Types.ObjectId, ref: "Topic" }, //公司
        job: { type: Schema.Types.ObjectId, ref: "Topic" }, //职位
      },
    ],
    select: false,
  },
  educations: {
    //教育经历
    type: [
      {
        //所有属性都是 话题 ref:'Topic' ->Schema
        school: { type: Schema.Types.ObjectId, ref: "Topic" }, //学校
        major: { type: Schema.Types.ObjectId, ref: "Topic" }, //专业
        diploma: { type: Number, enum: [1, 2, 3, 4, 5] }, //学历
        entrance_year: { type: Number }, //入学年份
        graduation_year: { type: Number }, //毕业年份
      },
    ],
    select: false,
  },
  following: {
    //关注了谁 id  Schema.Types.ObjectId
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    select: false, //select:false 默认不显示
  },
  followingTopics: {
    //关注了话题  Schema.Types.ObjectId 多对多
    type: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
    select: false, //select:false 默认不显示
  },
  likingAnswers: {
    //赞
    type: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
    select: false, //select:false 默认不显示
  },
  dislikingAnswers: {
    //踩
    type: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
    select: false, //select:false 默认不显示
  },
  collectingAnswers: {
    //收藏答案
    type: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
    select: false, //select:false 默认不显示
  }
});

module.exports = model("User", userSchema);
