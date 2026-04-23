import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  fileBuffer,
  folder = "projects",
  options = {},
) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: options.resource_type || "image",
          public_id: options.public_id,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      )
      .end(fileBuffer);
  });
};
export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return null;

  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result; // { result: 'ok' | 'not found' }
  } catch (error) {
    console.error("Delete cloudinary error:", error);
    throw error;
  }
};

export default cloudinary;
