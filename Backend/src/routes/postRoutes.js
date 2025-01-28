import express from "express";
import { addpost,updatemypost,randompost,getmypost } from "../controller/postController";

const postrouter = express.Router();

postrouter.post("/addpost", addpost);

postrouter.put("/updatemypost",updatemypost);

postrouter.get("/getmypost", getmypost);

postrouter.get("/randompost",randompost);

export default postrouter;