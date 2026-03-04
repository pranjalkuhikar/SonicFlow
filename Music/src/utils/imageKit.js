import ImageKit from "imagekit";
import config from "../configs/config.js";

const imageKit = new ImageKit({
  publicKey: config.imageKitPublicKey,
  privateKey: config.imageKitPrivateKey,
  urlEndpoint: config.imageKitUrlEndpoint,
});

export const uploadToImageKit = async (file, folderName) => {
  try {
    const result = await imageKit.upload({
      file: file.buffer,
      fileName: Date.now() + "-" + file.originalname,
      folder: folderName,
    });

    return result;
  } catch (error) {
    throw new Error("ImageKit upload failed");
  }
};

export const deleteFromImageKit = async (fileId) => {
  try {
    await imageKit.deleteFile(fileId);
  } catch (error) {
    throw new Error("ImageKit delete failed");
  }
};
