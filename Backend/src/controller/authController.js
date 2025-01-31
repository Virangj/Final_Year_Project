import { sendVerificationEmail, sendWelcomeEmail } from "../lib/email.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";


export const signup = async (req, res) => {
  const { username, email, password, phone, role } = req.body;
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (!["normal", "artist"].includes(role)) {
      return res
        .status(400)
        .json({ message: "Role should normal user or artist user Only! " });
    }

    const user = await User.findOne({ email });

    if (user)
      return res
        .status(400)
        .json({ message: "User has been already registered." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newUser = new User({
      username,
      email,
      phone,
      role,
      password: hashedPassword,
      verificationCode,
    });

    sendVerificationEmail(email, verificationCode);

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid User data" });
    }
  } catch (error) {
    console.log("Error Signup Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      firstname: user.firstName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in Login Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out" });
  } catch (error) {
    console.log("Error in Logout Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const emailVerificationCheck = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findOne({
      verificationCode: code,
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid Code or Expired Code." });
    }
    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();
    sendWelcomeEmail(user.email);
    return res.status(200).json({ message: "User isVerified! " });
  } catch (error) {
    console.log("Error in checking email verifcation: ", error);
    res
      .status(500)
      .json({ message: "Error checking verification", error: error.message });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in check controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

