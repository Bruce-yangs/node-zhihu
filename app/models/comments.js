const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const commentSchema = new Schema({
  __v: { type: Number, select: false },
  content: { type: String, required: true }, //名称
  questionId: { type: String, required: true },
  answerId: { type: String, required: true },
  commentator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    select: false,
  }, //答案回答者用户
});
module.exports = model("Comment", commentSchema);
