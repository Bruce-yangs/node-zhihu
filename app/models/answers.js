const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const answersSchema = new Schema({
  __v: { type: Number, select: false },
  content: { type: String, required: true }, //名称
  topics: { type: String },
  questionId: { type: String, required: true },
  voteCount: { type: Number, required: true, default: 0 },//投票数
  answerer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    select: false,
  }, //答案回答者用户
},{
  timestamps:true
});
module.exports = model("Answer", answersSchema);
