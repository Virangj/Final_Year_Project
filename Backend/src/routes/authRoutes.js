import express from "express";
import { emailVerificationCheck, login, logout, signup } from "../controller/authController.js";

const router = express.Router();

router.post("/signup" ,signup);

router.post("/emailcheck", emailVerificationCheck);

router.post("/login", login);

router.post("/logout", logout);

export default router;