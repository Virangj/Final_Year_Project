import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    profilePic: {
      type: "string",
    },
    name: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: "string",
      required: true,
    },
    phone: {
      type: "number",
      required: true,
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
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of followers
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of users they follow
    verificationCode: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userschema);
export default User;
