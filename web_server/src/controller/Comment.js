// src/controllers/commentController.js
const Comment = require("../models/Comment");
const Notification = require("../models/Notify");
const User = require("../models/User");

// Create a comment
const createComment = async (req, res) => {
  console.log(req.body);

  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getCommentsByFilm = async (req, res) => {
  // Parse the limit from the query parameter, defaulting to 5
  const limit = parseInt(req.query.limit, 10) || 5;

  try {
    // Query the Comment model
    const comments = await Comment.find({ filmId: req.params.filmId })
      .populate({
        path: "replies",
        populate: {
          path: "userId",
          select: ["fullName", "avatar"],
        },
      })
      .populate({
        path: "userId",
        select: ["fullName", "avatar"],
      })
      .limit(limit);

    // Send the comments in the response
    res.status(200).json(comments);
  } catch (error) {
    // Handle any errors that occur during the query
    console.error(error); // Log the error for debugging
    res.status(500).json({
      message: "An error occurred while fetching comments.",
      error: error.message,
    });
  }
};
// Update a comment
const updateComment = async (req, res) => {
  const { commentId, userId, type } = req.body;
  try {
    const comment = await Comment.findById(commentId);
    // Check if user has already liked
    if (type) {
      if (comment.userLike.includes(userId)) {
        comment.userLike.pull(userId);
        comment.likeCount--;
      } else {
        comment.userLike.push(userId);
        comment.likeCount++;
      }
    } else {
      if (comment.userDisLike.includes(userId)) {
        comment.userDisLike.pull(userId);
        comment.disLikeCount--;
      } else {
        comment.userDisLike.push(userId);
        comment.disLikeCount++;
      }
    }

    const data = await comment.save();
    res.status(200).json({ message: "Comment liked successfully.", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addReplyToComment = async (req, res) => {
  const { parentCommentId, userId, commentTxt, filmId, repOf } = req.body;

  try {
    // Create the reply comment with a reference to the parent comment
    const reply = new Comment({
      userId: userId,
      commentTxt: commentTxt,
      parentCommentId: parentCommentId,
    });

    // Save the reply comment
    const savedReply = await reply.save();

    // Add the reply to the parent's replies array
    const parentComment = await Comment.findByIdAndUpdate(parentCommentId, {
      $push: { replies: savedReply._id },
    });

    if (parentComment && parentComment.userId.toString() !== userId) {
      // Fetch the user's full name for notification
      const user = await User.findById(userId);

      // Create a notification for the original comment's author
      const notification = new Notification({
        title: "New Reply to Your Comment",
        message: `${
          user ? user.fullName : "someone"
        } đã trả lời comment của bạn.`,
        userId: parentComment.userId, // Notify the original comment's author
        status: "unread",
        repOf: repOf,
        filmId: filmId, // Set the fillmId to the parent comment's ID for notification purpose,
      });

      // Save the notification
      await notification.save();
    }

    res.status(200).json({ message: "Reply added successfully.", savedReply });
  } catch (error) {
    console.error("Error adding reply to comment:", error);
    res.status(500).json({ error: "Error adding reply to comment" });
  }
};

module.exports = {
  createComment,
  getCommentsByFilm,
  updateComment,
  deleteComment,
  addReplyToComment,
};
