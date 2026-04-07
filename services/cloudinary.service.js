const cloudinary = require("../config/cloudinary");

const uploadImage = async (filePath, folder = "uploads") => {
  return await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "auto",
  });
};

module.exports = { uploadImage };
