import express from "express";
import {  updateProfile, followUser, unFollowUser, getFollowers, getFollowing, editprofile } from "../controller/updateController.js";
import { multerUpload } from "../middleware/multerMiddleware.js";

const updateRoutesoutes = express.Router();

updateRoutesoutes.patch("/updateProfile",multerUpload.single('file'), updateProfile)

updateRoutesoutes.patch("/editProfile",multerUpload.single('profilePic'), editprofile)

updateRoutesoutes.post("/:userId/follow", followUser)

updateRoutesoutes.delete("/:userId/unfollow", unFollowUser);

updateRoutesoutes.get("/:userId/followers", getFollowers);

updateRoutesoutes.get("/:userId/following", getFollowing);

export default updateRoutesoutes