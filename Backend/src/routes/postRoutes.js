import express from "express";
import { addpost,updatemypost,randompost,getmypost, deletemypost } from "../controller/postController.js";
import { multerUpload } from "../middleware/multerMiddleware.js";

const postRoutes = express.Router();

postRoutes.post("/addpost", multerUpload.array('files'), addpost);

postRoutes.put("/updatemypost",updatemypost);

postRoutes.get("/getmypost", getmypost);

postRoutes.get("/randompost",randompost);

postRoutes.delete("/delete", deletemypost);

export default postRoutes;