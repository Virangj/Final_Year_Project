import express from "express"
import { protectedRoute } from "../middleware/authMiddleware.js";
import {  updateProfile, followUser, unFollowUser, getFollowers, getFollowing } from "../controller/updateController.js";
import { multerUpload } from "../middleware/multerMiddleware.js";

const updateRoutesoutes = express.Router();

updateRoutesoutes.put("/updateProfile",multerUpload.single('file'),protectedRoute, updateProfile)

updateRoutesoutes.post("/follow",protectedRoute, followUser)

updateRoutesoutes.delete("/:userId/unfollow", unFollowUser);

updateRoutesoutes.get("/:userId/followers", getFollowers);

updateRoutesoutes.get("/:userId/following", getFollowing);

export default updateRoutesoutes