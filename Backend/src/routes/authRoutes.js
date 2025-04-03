import express from "express";
import {
  checkAuth,
  emailAddressCheck,
  emailVerificationCheck,
  login,
  logout,
  signup,
} from "../controller/authController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/verificationcode", emailVerificationCheck);

router.post("/emailaddress",emailAddressCheck)

router.post("/login", login);

router.post("/logout", logout);

router.get("/check", protectedRoute, checkAuth);

export default router;
