import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * protect middleware
 * Expects Authorization: Bearer <token>
 * Attaches req.user = { id, email, name? }
 */

export const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ message: "No token provided" });

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = { id: user._id.toString(), email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized" });
  }
};
