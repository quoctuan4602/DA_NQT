const express = require("express");
const router = express.Router();
const notificationController = require("../controller/Notify");

// Route to create a new notification
router.post("/", notificationController.createNotification); // Create notification

// Route to get all notifications
router.get("/", notificationController.getAllNotifications); // Get all notifications

// Route to get a single notification by ID
router.get("/get/:id", notificationController.getNotificationById); // Get notification by ID
router.get("/get-rep-of/:refOf", notificationController.findByRefOf); // Get notification by ID

// Route to update a notification by ID
router.put("/:id", notificationController.updateNotification); // Update notification

// Route to delete a notification by ID
router.delete("/:id", notificationController.deleteNotification); // Delete notification

module.exports = router;
