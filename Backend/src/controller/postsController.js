import Post from "../models/postModel.js"; // Post model is in 'models/Post.js'

export const postlike = async (req, res) => {
  const { postId } = req.body;
  const userId = req.cookies.jwt;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Check if user already liked the post
    if (post.likes.userId.includes(userId)) {
      return res.status(400).json({ message: "User already liked this post" });
    }

    // Increase like count and add user to likedBy array
    post.likes.Totallike += 1;
    post.likes.userId.push(userId);
    await post.save();

    res.json({
      message: "Post liked successfully",
      likes: post.likes.Totallike,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const postunlike = async (req, res) => {
  const { postId } = req.body;
  const userId = req.cookies.jwt;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Check if user already liked the post
    if (post.likes.userId.includes(userId)) {
      // Increase like count and add user to likedBy array
      post.likes.Totallike -= 1;
      post.likes.userId = post.likes.userId.filter(
        (id) => id.tostring() !== userId.tostring()
      );
      await post.save();

      res.json({
        message: "Post Unliked successfully",
        likes: post.likes.Totallike,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// *1. Create a Comment*
export const addcomment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const userId = req.cookies.jwt;

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
      return res
        .status(400)
        .json({
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

// API Route to get 8 random posts (with lazy loading support)
export const randomposts = async (req, res) => {
  // try {
  //   // Get the `skip` and `limit` from query parameters (defaults are set if not provided)
  //   const page = parseInt(req.query.page) || 1;
  //   const limit = parseInt(req.query.limit) || 10;
  //   const skip = (page - 1) * limit; //calculate skip for pagination

  //   // Fetch posts and total count
  //   const posts = await Post.find().skip(skip).limit(limit).exec();
  //   const totalposts = await Post.countDocuments();

  //   res
  //     .status(200)
  //     .json({ data: posts, hasMore: skip + posts.length < totalposts });
  // } catch (error) {
  //   console.error("Error fetching random posts:", error);
  //   res
  //     .status(500)
  //     .json({ message: "Error fetching posts", error: error.message });
  //}
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find().skip(skip).limit(limit);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
