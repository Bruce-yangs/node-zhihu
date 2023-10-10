const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const commentSchema = new Schema({
  __v: { type: Number, select: false },
  content: { type: String, required: true }, //名称
  questionId: { type: String, required: true },
  answerId: { type: String, required: true },
  rootCommentId: { type: String },//根评论
  replyTo: { type: Schema.Types.ObjectId, ref: "User" },//回复某人
  commentator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    select: false,
  }, //答案回答者用户
},{
  timestamps:true
});
module.exports = model("Comment", commentSchema);
