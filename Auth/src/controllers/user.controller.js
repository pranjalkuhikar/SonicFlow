import User from "../models/register.model.js";
import config from "../configs/config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { publishToQueue } from "../broker/rabbit.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExits = await User.findOne({ email });
    if (userExits) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    await publishToQueue("User Created", {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;

    const isUserAlreadyExists = await User.findOne({
      $or: [{ email: user.emails[0].value }, { googleId: user.id }],
    });

    if (isUserAlreadyExists) {
      const token = jwt.sign(
        { userId: isUserAlreadyExists._id },
        config.JWT_SECRET,
        {
          expiresIn: "1h",
        },
      );
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.redirect(config.Frontend_URL);
    }

    const newUser = await User.create({
      googleId: user.id,
      email: user.emails[0].value,
      firstName: user.name.givenName,
      lastName: user.name.familyName,
    });

    const token = jwt.sign({ userId: newUser._id }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.redirect(config.Frontend_URL);
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
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userResponse = userExits.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Login successfully",
      userExits: userResponse,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const profile = (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      message: "Welcome to your profile",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: "lax", path: "/" });
    res.status(200).json({ message: "Logout successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
