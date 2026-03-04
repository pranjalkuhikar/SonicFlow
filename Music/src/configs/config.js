import dotenv from "dotenv";

dotenv.config();

const _config = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  Frontend_URL: process.env.Frontend_URL,
  imageKitPublicKey: process.env.imageKitPublicKey,
  imageKitPrivateKey: process.env.imageKitPrivateKey,
  imageKitUrlEndpoint: process.env.imageKitUrlEndpoint,
};

const config = Object.freeze(_config);

export default config;
