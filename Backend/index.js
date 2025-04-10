import express from "express";
import dotenv from "dotenv";
import { ConnectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import updateRoutesoutes from "./src/routes/updateRoutes.js";
import postsRoutes from "./src/routes/postsRoutes.js";
import exploreRoutes from "./src/routes/exploreRoutes.js";
import cors from 'cors';
import NotificationRoutes from "./src/routes/notificationRoutes.js";
//! import http from "http";
//! import { Server } from "socket.io";
//! import { initSocket } from "./socket/socket.io.js";


// Configuration of dotenv 
dotenv.config();

// Creating variables
const app = express();
const PORT = process.env.PORT;
//! const server = http.createServer(app);
//! const io = new Server(server, {
//!   cors: {
//!     origin: "*", // Update this as per your frontend URL
//!     methods: ["GET", "POST"],
//!   },
//! });

// All middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  "https://creativethread-c3a89.web.app"
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


// Creating All API's
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/update", updateRoutesoutes);
app.use("/api/posts",postsRoutes)
app.use("/api/explore", exploreRoutes)
app.use("/api/notifications", NotificationRoutes);

//! initSocket(io);


app.listen(PORT, () =>{
    ConnectDB()
    console.log("Server is running on port: " + PORT);
})