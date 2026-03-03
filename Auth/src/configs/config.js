import dotenv from "dotenv";

dotenv.config();

const _config = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  Frontend_URL: process.env.Frontend_URL,
};

const config = Object.freeze(_config);

export default config;
