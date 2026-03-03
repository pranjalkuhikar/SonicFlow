import User from "../models/register.model.js";
import bcrypt from "bcryptjs";

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
    res.status(400).send(err);
  }
};
