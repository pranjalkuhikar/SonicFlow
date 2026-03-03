import express from "express";
import {
  register,
  login,
  profile,
  logout,
  googleAuthCallback,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  registerValidator,
  loginValidator,
} from "../middlewares/validators.js";
import passport from "passport";

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.get("/profile", authenticate, profile);
router.post("/logout", logout);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthCallback,
);

export default router;
