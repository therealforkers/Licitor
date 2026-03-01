import "server-only";

import { v2 as cloudinary } from "cloudinary";

const getEnv = (key: keyof NodeJS.ProcessEnv) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is required.`);
  }

  return value;
};

const getCloudinaryConfig = () => {
  const cloudName = getEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = getEnv("CLOUDINARY_API_KEY");
  const apiSecret = getEnv("CLOUDINARY_API_SECRET");
  const uploadPreset = getEnv("CLOUDINARY_UPLOAD_PRESET");

  cloudinary.config({
    api_key: apiKey,
    api_secret: apiSecret,
    cloud_name: cloudName,
    secure: true,
  });

  return {
    apiKey,
    apiSecret,
    cloudName,
    uploadPreset,
  };
};

export const createSignedUploadParams = () => {
  const { apiKey, apiSecret, cloudName, uploadPreset } = getCloudinaryConfig();
  const folder = "licitor/listings";
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = {
    folder,
    timestamp,
    upload_preset: uploadPreset,
  };

  return {
    apiKey,
    cloudName,
    folder,
    signature: cloudinary.utils.api_sign_request(paramsToSign, apiSecret),
    timestamp,
    uploadPreset,
  };
};

export const deleteCloudinaryImage = async (publicId: string) => {
  getCloudinaryConfig();

  return cloudinary.uploader.destroy(publicId, {
    invalidate: true,
    resource_type: "image",
  });
};
