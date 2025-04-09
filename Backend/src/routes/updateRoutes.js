import express from "express";
import {  personalinfo, followUser, unFollowUser, getFollowers, getFollowing, editprofile,  } from "../controller/updateController.js";
import { multerUpload } from "../middleware/multerMiddleware.js";

const updateRoutesoutes = express.Router();

updateRoutesoutes.patch("/personalinfo", personalinfo)

updateRoutesoutes.patch("/editProfile",multerUpload.single('profilePic'), editprofile)

updateRoutesoutes.post("/:userId/follow", followUser)

updateRoutesoutes.delete("/:userId/unfollow", unFollowUser);

updateRoutesoutes.get("/:userId/followers", getFollowers);

updateRoutesoutes.get("/:userId/following", getFollowing);

export default updateRoutesoutes