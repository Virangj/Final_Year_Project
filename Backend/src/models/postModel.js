import mongoose from "mongoose";

const postschema = new mongoose.Schema({
    postId: {
        type: Number,
        unique: true,  // Ensures each post has a unique identifier
        required: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,  // Automatically trims extra spaces
    },
    title: {
        type: String,
        required: true,
        trim: true,  // Automatically trims extra spaces
    },
    description: {
        type: String,
        required: true,
    },
    image: [{
      type: String,  // This can be a URL to the image
      required: true,
    }],
    likes: [{
        userlike: {
            type: Number,
            default: 0,  // Default value of likes is 0
        },
        username: {
            type: String,
        },
    }],
    comments: [{
        username: {
            type: String,  // Assuming you have a User model
        },
        text: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }],
    createdAt: {
        type: Date,
        
    },
    updatedAt: {
        type: Date,
        
    },
});

// Set up a pre-save hook to update the updatedAt field before saving the post
/*postSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});*/


const Post = mongoose.model("Post", postschema);
export default Post;
