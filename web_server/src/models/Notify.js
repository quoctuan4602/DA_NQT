const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  repOf: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  notificationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["unread", "read"], default: "unread" },
  filmId: { type: mongoose.Schema.Types.ObjectId },
});

const Notification = mongoose.model("notifications", notificationSchema);

module.exports = Notification;
