import jwt from "jsonwebtoken";
import config from "../configs/config.js";

export const authenticateArtist = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    if (decoded.role !== "artist") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = { id: decoded.userId };

    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "Invalid or expired token", error: err.message });
  }
};
