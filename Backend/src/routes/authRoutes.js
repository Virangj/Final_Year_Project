import express from "express";
import {
  checkAuth,
  emailVerificationCheck,
  login,
  logout,
  signup,
} from "../controller/authController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/emailcheck", emailVerificationCheck);

router.post("/login", login);

router.post("/logout", logout);

router.get("/check", protectedRoute, checkAuth);

export default router;
