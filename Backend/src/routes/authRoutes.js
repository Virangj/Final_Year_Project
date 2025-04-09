import express from "express";
import {
  checkAuth,
  emailAddressCheck,
  emailVerificationCheck,
  login,
  logout,
  signup,
  // resetpassword,
} from "../controller/authController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";
import { trackUserActivity } from "../middleware/TrackUserMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/verificationcode", emailVerificationCheck);

router.post("/emailaddress",emailAddressCheck)

router.post("/login", login);

router.post("/logout", logout);

router.get("/check", protectedRoute, checkAuth);

// router.post("/resetpassword", protectedRoute, trackUserActivity, resetpassword);

// router.post("/sendotp", protectedRoute, sendOtp);

// router.post("/checkotp", protectedRoute, checkOtp);

export default router;
