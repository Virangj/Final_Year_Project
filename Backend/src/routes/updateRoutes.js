import express from "express"
import { protectedRoute } from "../middleware/authMiddleware.js";
import {  updateProfile, followUser, unFollowUser, getFollowers, getFollowing, editprofile } from "../controller/updateController.js";
import { multerUpload } from "../middleware/multerMiddleware.js";

const updateRoutesoutes = express.Router();

updateRoutesoutes.patch("/updateProfile",multerUpload.single('file'),protectedRoute, updateProfile)

updateRoutesoutes.patch("/editProfile",multerUpload.single('profilepic'),protectedRoute, editprofile)

updateRoutesoutes.post("/:userId/follow", followUser)

updateRoutesoutes.delete("/:userId/unfollow", unFollowUser);

updateRoutesoutes.get("/:userId/followers", getFollowers);

updateRoutesoutes.get("/:userId/following", getFollowing);

export default updateRoutesoutes