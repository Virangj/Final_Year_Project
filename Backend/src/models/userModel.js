import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    profilePic: {
      type: "string",
    },
    firstName: {
      type: "string",
      required: true,
    },
    lastName: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      required: true
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
    role:{
      type: "string",
      enum: ["normal" , "artist"],
      require : true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userschema);
export default User;
