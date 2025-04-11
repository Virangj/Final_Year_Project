// routes/notificationRoutes.js
import express from "express";
import { createNotification, getUserNotifications } from "../controller/notificationController.js";

const NotificationRoutes = express.Router();

// Create a notification (optional API)
NotificationRoutes.post("/create", createNotification);

// Get all notifications for a user
NotificationRoutes.get("/:userId", getUserNotifications);

export default NotificationRoutes;
