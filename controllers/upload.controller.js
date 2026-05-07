import { uploadToStorage, deleteFromStorage } from "../config/storage.js";

/**
 * POST /admin/upload?folder=xxx
 * Nhận file qua multer, lưu lên VPS, trả về { url, public_id }
 */
export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file provided" });
    }

    const folder = req.query.folder || "general";
    const result = await uploadToStorage(file.buffer, folder, file.originalname);

    return res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("uploadFile error:", error);
    return res.status(500).json({ success: false, message: "Upload failed" });
  }
};

/**
 * DELETE /admin/upload
 * Xóa file theo public_id (tự động phát hiện VPS hay Cloudinary)
 */
export const deleteFile = async (req, res) => {
  try {
    const { public_id, resource_type } = req.body;
    if (!public_id) {
      return res
        .status(400)
        .json({ success: false, message: "public_id is required" });
    }

    const result = await deleteFromStorage(public_id, resource_type || "image");
    return res.json({ success: true, result });
  } catch (error) {
    console.error("deleteFile error:", error);
    return res.status(500).json({ success: false, message: "Delete failed" });
  }
};
