import crypto from "crypto";
import { deleteFromStorage as deleteFromCloudinary } from "../config/storage.js";

export const getUploadSignature = (req, res) => {
  try {
    const { folder = "general" } = req.query;
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
      .digest("hex");
    return res.json({
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      folder,
    });
  } catch (error) {
    console.error("getUploadSignature error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteCloudinaryImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ success: false, message: "public_id is required" });
    }
    const result = await deleteFromCloudinary(public_id);
    return res.json({ success: true, result });
  } catch (error) {
    console.error("deleteCloudinaryImage error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
