import mongoose from "mongoose";

const Artistschema = new mongoose.Schema(
  {
    profilePic: {
      type: "string",
    },
    fullName: {
      type: "string",
      required: true,
    },
    lastName: {
      type: "string",
      required: true,
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
      type: "string",
      required: true,
    },
    gender: {
      type: "string",
      required: true,
    },
    country: {
      type: "string",
      required: true,
    },
    city: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Artist = mongoose.models("Artist", Artistschema);
export default Artist;
