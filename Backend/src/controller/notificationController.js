// controllers/notificationController.js
import Notification from "../models/NotificationModel.js";
// @desc Create a new notification
export const createNotification = async (req, res) => {
  try {
    const { recipient, sender, type, content, postId } = req.body;

    const notification = new Notification({
      recipient,
      sender,
      type,
      content,
      postId,
    });

    const saved = await Notification.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error("Create Notification Error:", err);
    res.status(500).json({ message: "Failed to create notification" });
  }
};

// @desc Get notifications for a user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "username profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Get Notification Error:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};
