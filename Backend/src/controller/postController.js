import multer from 'multer';
import cloudinary from '../config/cloudinary.js';  // Notice the .js extension
import Post from '../models/Post.js';  // Post model is in 'models/Post.js'





// Multer setup for image upload
const storage = multer.diskStorage({
 /* destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Temporary storage before uploading to Cloudinary
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
  },*/
});

const upload = multer({ storage });

// API Route to Add Post
export const addpost = async (req, res) => {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.body.filepath /*or req.file.path */,{folder: "your-folder-name",} );//optional: specify a folder in cloudinary

    // Create new post
    const newPost = new Post({
      postId: req.body.postId,
      username: req.body.username,
      title: req.body.title,
      description: req.body.description,
      image: result.secure_url,  // Store the image URL returned by Cloudinary
      likes: req.body.likes || 0,  // Default to 0 likes if not provided
      createdAt:Date.now()
    });

    // Save the post to the database
    await newPost.save();

    // Respond with the saved post
    res.status(201).json({
      message: 'Post added successfully!',
      post: newPost,
    });
  } catch (error) {
    console.error('Error uploading post:', error);
    res.status(500).json({ message: 'Error uploading post', error: error.message });
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
      return res.status(404).json({ message: 'No posts found for this artist' });
    }

    // Respond with the posts found
    res.status(200).json({
      message: `Posts found for artist: ${username}`,
      posts,
    });
  } catch (error) {
    console.error('Error fetching posts by artist:', error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
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
        updatedAt: Date.now(),  // Set the updatedAt field to the current date
      },
      { new: true }  // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Respond with the updated post
    res.status(200).json({
      message: 'Post updated successfully!',
      post: updatedPost,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};



// API Route to get 8 random posts (with lazy loading support)
export const randompost = async (req, res) => {
  try {
    // Get the `skip` and `limit` from query parameters (defaults are set if not provided)
    const page= parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip=(page-1)*limit;//calculate skip for pagination

    // Fetch posts and total count
    const posts= await Post.find().skip(skip).limit(limit).exec();
    const totalposts=await Post.countDocument();

    res.status(200).json({data:posts,hasMore:skip +posts.length<totalposts});
  } catch (error) {
    console.error('Error fetching random posts:', error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};




