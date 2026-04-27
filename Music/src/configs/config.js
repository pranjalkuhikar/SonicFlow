import dotenv from "dotenv";

dotenv.config();

const _config = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  Frontend_URL: process.env.Frontend_URL,
  imageKitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  imageKitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  imageKitUrlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  JWT_SECRET: process.env.JWT_SECRET,
};

const config = Object.freeze(_config);

export default config;
