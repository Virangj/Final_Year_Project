import User from "../models/userModel.js";

export const Checkrole = async (req, res, next) => {
    try {
        const role = req.query.role;
        if (role === "artist") {
            return next();
        }
        return res.status(401).json({ message: "Access denied. You are not an artist." });
    }
    catch (error) {
        console.log("Error in role middleware", error.message)
        res.status(500).json({ message: "Server Error" })
    }

}