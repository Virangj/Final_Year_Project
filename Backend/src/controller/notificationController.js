import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js"; // Assuming you have a User model to look up users by username

// Function to handle sending and saving notifications
const sendNotification = async ({ senderId, receiverId, type, postId }) => {
  let content = "";

  // Handle the different notification types and content
  if (type === "follow") {
    content = "started following you.";
  } else if (type === "like") {
    content = "liked your post.";
  } else if (type === "comment") {
    content = "commented on your post.";
  }

  // If receiverId is a username, we need to resolve it to the actual user ID
  let resolvedReceiverId = receiverId;
  if (typeof receiverId === "string") {
    try {
      const user = await User.findOne({ username: receiverId });

      if (!user) {
        throw new Error("User not found");
      }

      resolvedReceiverId = user._id; // Resolve the receiver's user ID
    } catch (error) {
      console.error("Error resolving receiver username:", error);
      throw new Error("Error resolving receiver username.");
    }
  }

  // Create notification in the database
  const notification = await Notification.create({
    recipient: resolvedReceiverId, // Ensure we are saving the user ID, not the username
    sender: senderId,
    type,
    content,
    postId,
    createdAt: new Date().toISOString(),
  });

  return notification;
};

// Function to emit the notification to the receiver
const emitNotification = (io, receiverId, notification) => {
  // Emit the notification to the receiver
  io.to(receiverId).emit("receiveNotification", {
    senderId: notification.sender,
    type: notification.type,
    content: notification.content,
    postId: notification.postId,
    createdAt: notification.createdAt, // Use the createdAt from the DB for consistency
  });
};

export default {
  sendNotification,
  emitNotification,
};
