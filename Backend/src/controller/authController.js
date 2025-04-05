import { sendVerificationEmail, sendWelcomeEmail, sendOtpEmail, sendPasswordChangeEmail } from "../lib/email.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";


export const signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  // console.log(req.body);  
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
    console.log("1")

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
      role,
      password: hashedPassword,
      verificationCode,
    });

    sendVerificationEmail(email, verificationCode);

    //generateToken(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      profilePic: newUser.profilePic,
    });

  } catch (error) {
    console.log("Error Signup Controller", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "user doesn`t exists" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      console.log(user.isVerified)
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      await User.findOneAndUpdate(
        { email },
        { verificationCode: verificationCode },
      );
      sendVerificationEmail(user.email, verificationCode);
      return res.status(200).json({
        emailverification: false,
        _id: user._id,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
        username: user.username,
        phone: user.phone,
      });
    }
    generateToken(user._id, res);

    res.status(200).json({
      emailverification: true,
      _id: user._id,
      email: user.email,
      profilePic: user.profilePic,
      role: user.role,
      username: user.username,
      phone: user.phone,
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
    const { code, email } = req.body;
    const user = await User.findOne({
      email
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid Code or Expired Code." });
    }
    if (user.verificationCode === code) {
      user.isVerified = true;
      user.verificationCode = null;
      await user.save();
      generateToken(User._id, res);
      sendWelcomeEmail(user.email);
      return res.status(200).json({ message: "User isVerified! " });
    } else {
      return res.status(404).json({ message: "incorrect code " });
    }
  } catch (error) {
    console.log("Error in checking email verifcation: ", error);
    res
      .status(500)
      .json({ message: "Error checking verification", error: error.message });
  }
};

export const checkAuth = (req, res) => {
  try {
    if (req.user.userId) return res.status(200).json({ message: "token is provided" })
    res.status(401).json({ message: "token not provided" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

export const emailAddressCheck = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      await user.save()
      sendVerificationEmail(email, verificationCode);
      res.status(200).json({ message: "code send successfully" })
    }
    else {
      res.status(401).json({ message: "user does'nt exists" })
    }
  } catch (error) {
    console.log("Error in checking email address: ", error);
    res
      .status(500)
      .json({ message: "Error in checking email address", error: error.message });
  }
};

export const resetpassword = async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ message: "user not found" })

    const isPasswordCorrect = await bcrypt.compare(oldpassword, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Incorrect password" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);
    await User.findByIdAndUpdate(req.user.userId, { password: hashedPassword })

    sendPasswordChangeEmail(user.email, req.userActivity);

    res.status(200).json({ message: "password change successfully" })
  } catch (error) {
    console.log("error :", error)
    res.status(500).json({ message: "internal server error" })
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      await user.save()
      sendOtpEmail(email, user.verificationCode);
      res.status(200).json({ username: user.username, email: user.email, })
    }
    else {
      res.status(401).json({ message: "user does'nt exists" })
    }
  } catch (error) {
    console.log("Error in checking email address: ", error);
    res
      .status(500)
      .json({ message: "Error in sending OTP", error: error.message });
  }
};

export const checkOtp = async (req, res) => {
  try {
    const { code, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Code or Expired Code." });
    }
    if (user.verificationCode === code) {
      user.verificationCode = null;
      await user.save();
      return res.status(200).json({ message: "User isVerified! " });
    } else {
      return res.status(404).json({ message: "incorrect code " });
    }
  } catch (error) {
    console.log("Error in checking otp : ", error);
    res
      .status(500)
      .json({ message: "Error checking OTP", error: error.message });
  }
};

export const changepassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ message: "user not found" })

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.findByIdAndUpdate(req.user.userId, { password: hashedPassword })

    sendPasswordChangeEmail(user.email, req.userActivity);

    res.status(200).json({ message: "password change successfully" })
  } catch (error) {
    console.log("error :", error)
    res.status(500).json({ message: "internal server error" })
  }
};

