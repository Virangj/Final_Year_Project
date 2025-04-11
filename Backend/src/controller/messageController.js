import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import cloudinary from "../lib/cloudinary.js"

export const getUserForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    console.log(filteredUsers);    
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Message getUserForSideBar error", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const user = await User.findById(req.decode.userId); // You said `user` var has full user info
    const myId = user._id.toString()
    // console.log(myId);        
    // console.log(userToChatId);

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("getMessage Controller Error: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res, io) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const user = await User.findById(req.decode.userId); // You said `user` var has full user info
    const senderId = user._id.toString();

    let imageURL;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageURL = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageURL,
    });

    await newMessage.save();

    // Emit the message via Socket.io

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("sendMessage Controller Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
