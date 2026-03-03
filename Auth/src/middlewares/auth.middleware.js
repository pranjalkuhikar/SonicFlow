import config from "../configs/config.js";

export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    res
      .status(500)
      .json({ message: "Invalid or expired token", error: err.message });
  }
};
