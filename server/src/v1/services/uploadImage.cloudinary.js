const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const nodeEnv = process.env.NODE_ENV;
const cloudName = process.env.CLOUD_NAME;
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: nodeEnv === "development" ? false : true,
});

const options = {
  overwrite: true,
  invalidate: true,
  resource_type: "image",
  allowed_formats: ["jpg", "jpeg", "png"],
  disallow: ["bmp", "gif"],
  access_mode: "public",
  use_filename: true,
  type: "upload",
};

const uploadTwoImageToCloundinary = async (image50x50, image180x180) => {
  try {
    const [image50x50Result, image180x180Result] = await Promise.all([
      new Promise((resolve, reject) => {
        const cld_upload_stream = cloudinary.uploader.upload_stream(
          {
            folder: "avatars",
            ...options,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(image50x50).pipe(cld_upload_stream);
      }),
      new Promise((resolve, reject) => {
        const cld_upload_stream = cloudinary.uploader.upload_stream(
          {
            folder: "avatars",
            ...options,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(image180x180).pipe(cld_upload_stream);
      }),
    ]);

    return [image50x50Result, image180x180Result];
  } catch (error) {
    throw error;
  }
};

const uploadImageSize400x400ToCloundinary = async (image400x400) => {
  try {
    const [image400x400Result] = await Promise.all([
      new Promise((resolve, reject) => {
        const cld_upload_stream = cloudinary.uploader.upload_stream(
          {
            folder: "posts",
            ...options,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(image400x400).pipe(cld_upload_stream);
      }),
    ]);

    return [image400x400Result];
  } catch (error) {
    throw error;
  }
};

const deleteImageFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploadTwoImageToCloundinary,
  uploadImageSize400x400ToCloundinary,
  deleteImageFromCloudinary,
};
