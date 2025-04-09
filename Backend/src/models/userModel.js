import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    profilePic: {
      type: "string",
    },
    name: {
      type: "string",
    },
    username: {
      type: "string",
      require: true,
      unique: true,
    },
    bio:{
      type:"string",
    },
    arttype:{
      type:"string",
    },
    email: {
      type: "string",
      required: true,
    },
    phone: {
      type: "number",
    },
    dob: {
      type: "Date",
    },
    gender: {
      type: "string",
    },
    country: {
      type: "string",
    },
    city: {
      type: "string",
    },
    password: {
      type: "string",
      required: true,
    },
    role: {
      type: "string",
      enum: ["normal", "artist"],
      require: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }], // List of followers
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }], // List of users they follow
    verificationCode: {
      type: "string",
      default: null,
      expire: "60*10"
    },
  },
  {
    timestamps: true,
  },

);

const User = mongoose.model("User", userschema);
export default User;
