import config from "../configs/config.js";
import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");

    next();
  } catch (err) {
    res
      .status(500)
      .json({ message: "Invalid or expired token", error: err.message });
  }
};
