const Notification = require("../models/Notify"); // Adjust path as needed

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate("userId");

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single notification by ID
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update notification status
const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Find notifications by refOf (repOf)
const findByRefOf = async (req, res) => {
  const { refOf } = req.params; // Get the 'refOf' parameter from the request

  try {
    // Search for notifications with the specified 'repOf' value
    const notifications = await Notification.find({ repOf: refOf }).populate(
      "userId"
    );

    // Send the notifications as a response
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error finding notifications by refOf:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  findByRefOf, // Add this function to the exports if you want to use it in other routes
};
