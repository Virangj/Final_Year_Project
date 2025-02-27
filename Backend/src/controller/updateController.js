import { Readable } from "stream";
import cloudinary from "../lib/cloudinary.js"; // Notice the .js extension
import User from "../models/userModel.js";

const uploadtocloudinary = async (buffer) => {
  return new Promise(async (resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      { folder: "test" },
      function (error, result) {
        if (error) {
          return reject(error);
        }
        return resolve({ public_id: result.public_id, url: result.secure_url });
      }
    );

    Readable.from(buffer).pipe(cld_upload_stream);
  });
};

const uploader = async (file) => {
  const buffer = file.buffer;
  const result = await uploadtocloudinary(buffer);

  return result;
};

export const updateProfile = async (req, res) => {
  try {
    const { dob, gender, country, city, name } = req.body;
    const userId = req.user._id;

    // Create an object with only fields that should be updated
    let updateFields = { dob, gender, country, city, name };

    // Only update profilePic if a new image is uploaded
    if (req.file) {
      const upload_resp = await uploader(req.file);
      updateFields.profilePic = upload_resp.url;
    }

    // Find and update the user without modifying profilePic if no new image is uploaded
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateFields }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

export const followUser = async (req, res) => {
  try {
    const { userId } = req.params; // User being followed
    const { followerId } = req.body; // User who is following

    if (userId === followerId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const follower = await User.findById(followerId);

    if (!user || !follower) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following
    if (user.followers.includes(followerId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Add follower to user's followers list
    user.followers.push(followerId);
    await user.save();

    // Optionally, add user to follower's "following" list
    follower.following.push(userId);
    await follower.save();

    res.status(200).json({ message: "Followed successfully", user });
  } catch (error) {
    console.log("Error in updateFollowers controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unFollowUser = async (req, res) => {
  try {
    const { userId } = req.params; // The user being unfollowed
    const { followerId } = req.body; // The user who wants to unfollow

    const user = await User.findById(userId);
    const follower = await User.findById(followerId);

    if (!user || !follower) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.followers.includes(followerId)) {
      return res
        .status(400)
        .json({ message: "You are not following this user" });
    }

    user.followers = user.followers.filter(
      (id) => id.toString() !== followerId
    );
    follower.following = follower.following.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await follower.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    console.error("Unfollow User Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "followers",
      "username email"
    ); // Populate to get follower details

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ followers: user.followers });
  } catch (error) {
    console.error("Get Followers Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "following",
      "username email"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ following: user.following });
  } catch (error) {
    console.error("Get Following Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
