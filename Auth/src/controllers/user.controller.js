import User from "../models/register.model.js";
import config from "../configs/config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExits = await User.findOne({ email });
    if (userExits) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hashPassword });
    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExits = await User.findOne({ email });
    if (!userExits) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, userExits.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: userExits._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successfully",
      userExits,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const me = (req, res) => {
  try {
    const userId = req.user.userId;

    res.status(200).json({
      message: "Welcome to your profile",
      userId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
