import express from "express";
import dotenv from "dotenv";
import { ConnectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authRoutes.js";
import postRoutes from "./src/routes/postroutes.js";
import messageRoutes from "./src/routes/messageRoute.js";

// Configuration of dotenv 
dotenv.config();

// Creating variables
const app = express();
const PORT = process.env.PORT;

// All middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Creating All API's
app.use("/api/auth", authRoutes);
app.use("/api/post",postRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () =>{
    ConnectDB()
    console.log("Server is running on port: " + PORT);
})