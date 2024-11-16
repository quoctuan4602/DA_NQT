const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    filmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Film",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    commentTxt: { type: String, required: true },
    commened: { type: String },
    likeCount: { type: Number, default: 0 },
    disLikeCount: { type: Number, default: 0 },
    userLike: { type: Array, default: [] },
    userDisLike: { type: Array, default: [] },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // Self-referential reference to allow nesting
      default: null, // null means this comment is a root comment
    },
    // Optional array to track replies; you can use this if you want to keep a reference list in each comment
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
