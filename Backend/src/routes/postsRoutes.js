import express from "express";
import { addcomment,addreply,updatecomment,updatereply,deletecomment,deletereply,randomposts } from "../controller/postsController.js";

const postsRoutes = express.Router();

postsRoutes.post("/addcomment",addcomment);

postsRoutes.patch("/updatecomment",updatecomment);

postsRoutes.delete("/deletecomment",deletecomment);

postsRoutes.post("/addreply",addreply);

postsRoutes.patch("/updatereply",updatereply);

postsRoutes.delete("/deletereply",deletereply);

postsRoutes.get("/randomposts",randomposts);

export default postsRoutes;