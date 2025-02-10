import express from "express";
import { addpost,updatemypost,getmypost, deletemypost } from "../controller/postController.js";
import { multerUpload } from "../middleware/multerMiddleware.js";
import { Checkrole } from "../middleware/roleMiddlerware.js";

const postRoutes = express.Router();

postRoutes.post("/addpost",Checkrole, multerUpload.array('files'), addpost);

postRoutes.patch("/updatemypost",Checkrole,updatemypost);

postRoutes.get("/getmypost",Checkrole, getmypost);

postRoutes.delete("/delete",Checkrole, deletemypost);

export default postRoutes;