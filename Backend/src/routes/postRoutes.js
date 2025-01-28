import express from "express";
import { addpost,updatemypost,randompost,getmypost } from "../controller/postController.js";
import { multerUpload } from "../middleware/multerMiddlware.js";

const postRoutes = express.Router();

postRoutes.post("/addpost", multerUpload.array('files'), addpost);

postRoutes.put("/updatemypost",updatemypost);

postRoutes.get("/getmypost", getmypost);

postRoutes.get("/randompost",randompost);

export default postRoutes;