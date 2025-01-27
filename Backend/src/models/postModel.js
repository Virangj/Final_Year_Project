import mongoose from "mongoose";

const postschema = new mongoose.Schema(
  {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    image: {
      type: "string",
      required: true,
    },
    like: {
      type: "number",
    },
    comment: {
      type: "string",
    },
    username: {
      type: "string",
      require: true,
    },
    userid: {
      type: "string",
    },
    artistid: {
      type: "string",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.models("Post", postschema);
export default Post;
