import cloudinary from "../lib/cloudinary.js"; // Notice the .js extension
import Post from "../models/postModel.js"; // Post model is in 'models/Post.js'
import { Readable } from "stream";
import User from "../models/userModel.js";

export const postlike = async (req, res) => {
  const { postId } = req.body;
  const decoded = req.decode;
  console.log(decoded);
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(decoded.userId).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userIdStr = user._id.toString();

    // Check if the user already liked the post
    if (post.likes.userId.includes(userIdStr)) {
      return res.status(400).json({ message: "User already liked this post" });
    }

    // Add userId to likes array
    post.likes.userId.push(userIdStr);

    // Update total like count based on unique user IDs
    post.likes.Totallike = post.likes.userId.length;

    await post.save();

    return res.status(200).json({
      message: "Post liked successfully",
      likes: {
        Totallike: post.likes.Totallike,
        userId: post.likes.userId,
      },
    });
  } catch (error) {
    console.error("Error in postlike:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const postunlike = async (req, res) => {
  const { postId } = req.body;
  const decoded = req.decode;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(decoded.userId).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userIdStr = user._id.toString();

    // Check if user has not liked the post
    if (!post.likes.userId.includes(userIdStr)) {
      return res.status(400).json({ message: "User has not liked this post" });
    }

    // Remove userId from likes array
    post.likes.userId = post.likes.userId.filter(
      (id) => id.toString() !== userIdStr
    );

    // Update total like count
    post.likes.Totallike = post.likes.userId.length;

    await post.save();

    return res.status(200).json({
      message: "Post unliked successfully",
      likes: {
        Totallike: post.likes.Totallike,
        userId: post.likes.userId,
      },
    });
  } catch (error) {
    console.error("Error in unlikePost:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// *1. Create a Comment*
export const addcomment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const decoded = req.decode;
    const userId = decoded.userId

    if (!postId || !userId || !text) {
      return res
        .status(400)
        .json({ message: "Post ID, User ID, and text are required." });
    }

    const post = await Post.findById(postId);
    post.comments.push({ userId, text });

    await post.save();

    res.status(201).json({ message: "Comment added successfully!", post });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};
// *3. Update a Comment*
export const updatecomment = async (req, res) => {
  try {
    const { postId, commentIndex } = req.body;
    const { text } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (!post.comments[commentIndex]) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Update the comment text
    post.comments[commentIndex].text = text;

    // Save the updated post
    await post.save();

    res.status(200).json({ message: "Comment updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error });
  }
};

// *4. Delete a Comment*
export const deletecomment = async (req, res) => {
  try {
    const { postId, commentIndex } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (!post.comments[commentIndex]) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Remove the comment by index
    post.comments.splice(commentIndex, 1);

    // Save the updated post
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
};

export const addreply = async (req, res) => {
  try {
    const { postId, commentIndex, text } = req.body;
    const userId = req.cookies.jwt;

    if (!postId || !commentIndex || !userId || !text) {
      return res.status(400).json({
        message: "Post ID, Comment Index, User ID, and text are required.",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Check if the comment exists at the given index
    const comment = post.comments[commentIndex];
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Add the reply to the replies array of the comment
    comment.replies.push({ userId, text });

    // Save the post with the new reply
    await post.save();

    res.status(201).json({ message: "Reply added successfully!", post });
  } catch (error) {
    res.status(500).json({ message: "Error adding reply", error });
  }
};

export const deletereply = async (req, res) => {
  try {
    const { postId, commentIndex, replyIndex } = req.params;

    // Fetch the post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Get the comment at the specified index
    const comment = post.comments[commentIndex];

    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Get the reply at the specified index
    const reply = comment.replies[replyIndex];

    if (!reply) {
      return res.status(404).json({ message: "Reply not found." });
    }

    // Remove the reply from the replies array
    comment.replies.splice(replyIndex, 1);

    // Save the updated post with the removed reply
    await post.save();

    res.status(200).json({ message: "Reply deleted successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reply", error });
  }
};

export const updatereply = async (req, res) => {
  try {
    const { postId, commentIndex, replyIndex } = req.body;
    const { text } = req.body; // New text for the reply

    if (!text) {
      return res
        .status(400)
        .json({ message: "Text for the reply is required." });
    }

    // Fetch the post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Get the comment at the specified index
    const comment = post.comments[commentIndex];

    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Get the reply at the specified index
    const reply = comment.replies[replyIndex];

    if (!reply) {
      return res.status(404).json({ message: "Reply not found." });
    }

    // Update the reply text
    reply.text = text;

    // Save the updated post
    await post.save();

    res.status(200).json({ message: "Reply updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error updating reply", error });
  }
};

export const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// API Route to get 8 random posts (with lazy loading support)
export const randomposts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .skip(skip)
      .limit(limit)
      .populate("username", "username profilePic"); // 🧠 this fetches username and profilePic

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};


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
    // Find all posts by the given artist
    const posts = await Post.find({ createdBy: req.decode.userId });
    console.log(posts);


    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No posts found for this artist: " + posts.username });
    }
    // Respond with the posts found
    res.status(200).json({
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
    res.status(500).json({
      success: false,
      message: "Error deleting post",
      error: error.message,
    });
  }
};

export const suggested = async (req, res) => {
  try {
    const currentUser = await User.findById(req.decode.userId).select('following');

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const excludeIds = [req.decode.userId, ...currentUser.following];

    const suggestedUsers = await User.find({
      _id: { $nin: excludeIds },     // not followed and not current user
      role: 'artist'                 // only users with role "artist"
    })
      .limit(10)
      .select('username profilePic arttype followers');

    res.status(200).json({ suggestedUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getotheruserposts = async (req, res) => {
  try {
    const username = req.query.username;
    const posts = await Post.findOne({ username: username })
    if (!posts) return res.status(404).json({ message: "user have not posted " })
    return res.status(200).json(posts)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

