import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import indexRoute from "./routes/index.route.js";
import config from "./configs/config.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  cors({
    origin: config.Frontend_URL,
    credentials: true,
  }),
);

app.use(passport.initialize());
passport.use(
  new GoogleStrategy(
    {
      clientID: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);

app.use("/api", indexRoute);

export default app;
