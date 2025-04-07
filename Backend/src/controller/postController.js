import cloudinary from "../lib/cloudinary.js"; // Notice the .js extension
import Post from "../models/postModel.js"; // Post model is in 'models/Post.js'
import { Readable } from "stream";
import User from "../models/userModel.js"; 

const uploadtocloudinary = async (buffer) => {
  return new Promise(async (resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      { folder: "test" },
      function (error, result) {
        console.log(error, result);
        if (error) {
          return reject(error);
        }
        return resolve({ public_id: result.public_id, url: result.secure_url });
      }
    );

    Readable.from(buffer).pipe(cld_upload_stream);
  });
};

const uploader = async (files) => {
  const resp = [];
  for (let i = 0; i < files.length; i++) {
    const buffer = files[i].buffer;
    const result = await uploadtocloudinary(buffer);
    resp.push(result);
  }
  return resp;
};
// API Route to Add Post
export const addpost = async (req, res) => {
  try {
    const { postId, username, title, description } = req.body;

    // const result = await cloudinary.uploader.upload(req);
    const upload_resp = await uploader(req.files);
    console.log("upload_resp", upload_resp);
    const image_arr = [];
    for (let i = 0; i < upload_resp.length; i++) {
      const uploadedImage = upload_resp[i];
      image_arr.push(uploadedImage.url);
    }
    // Create new post
    const newPost = new Post({
      postId,
      username,
      title,
      description,
      image: image_arr, // Store the image URL returned by Cloudinary
      createdAt: Date.now(),
    });

    // Save the post to the database
    await newPost.save();

    // Respond with the saved post
    res.status(201).json({
      message: "Post added successfully!",
      post: newPost,
    });
  } catch (error) {
    console.error("Error uploading post:", error);
    res
      .status(500)
      .json({ message: "Error uploading post", error: error.message });
  }
};

// API Route to get posts by artist
export const getmypost = async (req, res) => {
  try {
    // Get the artist's name from the request parameters
    const  username  = req.query.username;
    console.log(username);

    // Find all posts by the given artist
    const posts = await Post.find({ createdBy: req.user.userId });

    if (posts.length === 0) {
      return res
        .status(401)
        .json({ message: "No posts found for this artist: " + username });
    }
    // Respond with the posts found
    res.status(200).json({
      message: `Posts found for artist: ${username}`,
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts by artist:", error);
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

// API Route to update a post
export const updatemypost = async (req, res) => {
  try {
    const { postId } = req.body;
    const { title, description } = req.body;

    // Find the post by postId and update it
    const updatedPost = await Post.findOneAndUpdate(
      { postId: postId },
      {
        title,
        description,
        updatedAt: Date.now(), // Set the updatedAt field to the current date
      },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Respond with the updated post
    res.status(200).json({
      message: "Post updated successfully!",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
};

export const deletemypost = async (req, res) => {
  try {
    const { postId } = req.query;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required. " });
    }

    const deletePost = await Post.findOneAndDelete({ postId: postId });

    if (!deletePost) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting post",
        error: error.message,
      });
  }
};

export const suggested = async (req, res) => {

  try {
    const currentUser = await User.findById(req.user.userId).select('following');

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const excludeIds = [req.user.userId, ...currentUser.following];

    const suggestedUsers = await User.find({
      _id: { $nin: excludeIds },     // not followed and not current user
      role: 'artist'                 // only users with role "artist"
    })
      .limit(10)
      .select('username profilepic arttype');

    res.status(200).json({ suggestedUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

