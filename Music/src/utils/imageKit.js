import ImageKit from "imagekit";
import config from "../configs/config.js";

const imageKit = new ImageKit({
  publicKey: config.imageKitPublicKey,
  privateKey: config.imageKitPrivateKey,
  urlEndpoint: config.imageKitUrlEndpoint,
});

export const uploadToImageKit = async (file) => {
  try {
    const result = await imageKit.upload({
      file: file.buffer,
      fileName: Date.now() + "-" + file.originalname,
    });

    return result;
  } catch (error) {
    throw new Error("ImageKit upload failed");
  }
};
