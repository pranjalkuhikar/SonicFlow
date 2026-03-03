import express from "express";
import {
  register,
  login,
  profile,
  logout,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  registerValidator,
  loginValidator,
} from "../middlewares/validators.js";

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.get("/profile", authenticate, profile);
router.post("/logout", logout);

export default router;
