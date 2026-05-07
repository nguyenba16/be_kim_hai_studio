import path from "path";
import fs from "fs/promises";
import { deleteFromCloudinary } from "./cloudinary.js";

const VPS_UPLOAD_DIR = "/var/www/uploads_kim_hai";
const VPS_BASE_URL = "https://kimhaiphongsucuoi.com/uploads_kim_hai";

// VPS public_ids luôn có phần mở rộng file (.jpg, .png, .mp4...)
// Cloudinary public_ids KHÔNG có phần mở rộng
const isVpsFile = (public_id) =>
  Boolean(public_id) && /\.[a-zA-Z0-9]{2,5}$/.test(public_id);

/**
 * Upload file buffer lên VPS.
 * Trả về { secure_url, public_id } giống Cloudinary để các controller không cần thay đổi.
 */
export const uploadToStorage = async (
  fileBuffer,
  folder = "general",
  originalname = "file.jpg",
) => {
  const ext = path.extname(originalname) || ".jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const relativePath = `${folder}/${filename}`;
  const fullDir = path.join(VPS_UPLOAD_DIR, folder);
  const fullPath = path.join(fullDir, filename);

  await fs.mkdir(fullDir, { recursive: true });
  await fs.writeFile(fullPath, fileBuffer);

  return {
    secure_url: `${VPS_BASE_URL}/${relativePath}`,
    public_id: relativePath, // có extension → nhận dạng là file VPS
  };
};

/**
 * Xóa file khỏi kho lưu trữ.
 * - Nếu public_id có phần mở rộng → file VPS → xóa trên đĩa.
 * - Ngược lại → ảnh Cloudinary cũ → gọi Cloudinary API.
 */
export const deleteFromStorage = async (public_id, resourceType = "image") => {
  if (!public_id) return null;

  if (isVpsFile(public_id)) {
    const fullPath = path.join(VPS_UPLOAD_DIR, public_id);
    try {
      await fs.unlink(fullPath);
    } catch (err) {
      if (err.code !== "ENOENT") {
        console.error("deleteFromStorage VPS error:", err);
      }
    }
    return { result: "ok" };
  }

  // Backward compat: ảnh cũ trên Cloudinary
  return deleteFromCloudinary(public_id, resourceType);
};

// Alias giữ nguyên tên cũ để các controller chỉ cần đổi đường dẫn import
export const uploadToCloudinary = (
  fileBuffer,
  folder = "general",
  options = {},
) => uploadToStorage(fileBuffer, folder, options.originalname || "file.jpg");

export const deleteFromCloudinary_compat = deleteFromStorage;
