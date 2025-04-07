import User from "../models/userModel.js";

export const Checkrole = async (req, res, next) => {
  try {
    const { userId } = req.decoded;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "artist") {
      return next();
    }

    return res.status(401).json({
      message: "Access denied. You are not an artist.",
    });

  } catch (error) {
    console.log("Error in role middleware:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

