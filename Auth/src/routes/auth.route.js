import express from "express";
import {
  register,
  login,
  profile,
  logout,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, profile);
router.post("/logout", logout);

export default router;
