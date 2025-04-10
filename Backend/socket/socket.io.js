// sockets/socket.js
import Notification from "../models/Notification.js";

const users = {};

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Save user socketId
    socket.on("addUser", (userId) => {
      users[userId] = socket.id;
    });

    // Receive notification from frontend
    socket.on("sendNotification", async ({ recipient, sender, type, content, postId }) => {
      try {
        const notification = new Notification({ recipient, sender, type, content, postId });
        const saved = await notification.save();

        // Send to specific recipient if online
        const recipientSocket = users[recipient];
        if (recipientSocket) {
          io.to(recipientSocket).emit("newNotification", {
            ...saved._doc,
            sender: {
              _id: sender._id,
              username: sender.username,
              profilePic: sender.profilePic,
            },
          });
        }
      } catch (err) {
        console.log("Socket notification error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
        }
      }
    });
  });
};
