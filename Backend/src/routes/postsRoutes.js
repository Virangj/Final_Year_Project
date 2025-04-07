import express from "express";
import { addcomment,addreply,updatecomment,updatereply,deletecomment,deletereply,randomposts,addpost,updatemypost,getmypost, deletemypost, postlike, postunlike } from "../controller/postsController.js";
import { Checkrole } from "../middleware/roleMiddlerware.js";
import { multerUpload } from "../middleware/multerMiddleware.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const postsRoutes = express.Router();

postsRoutes.post("/addcomment",addcomment);

postsRoutes.patch("/updatecomment",updatecomment);

postsRoutes.delete("/deletecomment",deletecomment);

postsRoutes.post("/likepost", protectedRoute , postlike)

postsRoutes.post("/unlikepost" , postunlike)

postsRoutes.post("/addreply",addreply);

postsRoutes.patch("/updatereply",updatereply);

postsRoutes.delete("/deletereply",deletereply);

postsRoutes.get("/randomposts",randomposts);

postsRoutes.post("/addpost",protectedRoute,Checkrole, multerUpload.array('files'), addpost);

postsRoutes.patch("/updatemypost",Checkrole,updatemypost);

postsRoutes.get("/getmypost",Checkrole, getmypost);

postsRoutes.delete("/delete",Checkrole, deletemypost);

export default postsRoutes;