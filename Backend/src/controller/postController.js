import cloudinary from "../lib/cloudinary.js"; // Notice the .js extension
import Post from "../models/postModel.js"; // Post model is in 'models/Post.js'
import { Readable } from "stream";

const uploadtocloudinary = async (buffer)=>{
  return new Promise(async (resolve,reject)=>{
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      { folder: "test" },
      function (error, result) {
        console.log(error, result);
        if(error){
          return reject(error);
        }
        return resolve({ public_id: result.public_id, url: result.secure_url });
      }
    );
    
    Readable.from(buffer).pipe(cld_upload_stream);
  })
}

const uploader = async (files) => {
    const resp = [];
    for (let i = 0; i < files.length; i++) {
      const buffer = files[i].buffer;;
      const result = await uploadtocloudinary(buffer);
      resp.push(result);
    }
    return resp

};
// API Route to Add Post
export const addpost = async (req, res) => {
  try {
    console.log("req.files", req.files);
    console.log("req.body", req.body);
    const { postId, username, title, description } = req.body;
    console.log(postId);

    // Upload image to Cloudinary
    // const result = await cloudinary.uploader.upload(req);
    const upload_resp = await uploader(req.files);
    console.log("upload_resp", upload_resp);
    const image_arr = []
    for(let i=0;i<upload_resp.length;i++){
      const uploadedImage = upload_resp[i]
      image_arr.push(uploadedImage.url)
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
    const { username } = req.query.username;

    // Find all posts by the given artist
    const posts = await Post.find({ username });

    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No posts found for this artist" });
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
    const { title, description, image } = req.body;

    // Find the post by postId and update it
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        description,
        image,
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

// API Route to get 8 random posts (with lazy loading support)
export const randompost = async (req, res) => {
  try {
    // Get the `skip` and `limit` from query parameters (defaults are set if not provided)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit; //calculate skip for pagination

    // Fetch posts and total count
    const posts = await Post.find().skip(skip).limit(limit).exec();
    const totalposts = await Post.countDocument();

    res
      .status(200)
      .json({ data: posts, hasMore: skip + posts.length < totalposts });
  } catch (error) {
    console.error("Error fetching random posts:", error);
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};
