import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { deleteFromCloudinary } from "./cloudinary.js";

const VPS_UPLOAD_DIR = process.env.UPLOAD_DIR || "/var/www/uploads_kim_hai";
const VPS_BASE_URL = process.env.UPLOAD_BASE_URL || "https://kimhaiphongsucuoi.com/uploads_kim_hai";

const IMAGE_EXTS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".tiff",
  ".tif",
  ".avif",
]);

// VPS public_ids luôn có phần mở rộng file (.jpg, .png, .mp4...)
// Cloudinary public_ids KHÔNG có phần mở rộng
const isVpsFile = (public_id) =>
  Boolean(public_id) && /\.[a-zA-Z0-9]{2,5}$/.test(public_id);

// Nén ảnh sang WebP quality 85, giữ ICC color profile. Fallback về null nếu lỗi.
async function optimizeImage(buffer) {
  try {
    const optimized = await sharp(buffer, { failOn: "none" })
      .withMetadata() // giữ ICC color profile, quan trọng cho photographer
      .webp({ quality: 85, effort: 4 })
      .toBuffer();
    return { buffer: optimized, ext: ".webp" };
  } catch (err) {
    console.error("Image optimization failed, using original:", err.message);
    return null;
  }
}

/**
 * Upload file buffer lên VPS.
 * Ảnh tự động nén sang WebP quality 85 trước khi ghi.
 * Video/file khác ghi nguyên buffer.
 * Trả về { secure_url, public_id } giống Cloudinary để các controller không đổi.
 */
export const uploadToStorage = async (
  fileBuffer,
  folder = "general",
  originalname = "file.jpg",
) => {
  let ext = path.extname(originalname).toLowerCase() || ".jpg";
  let finalBuffer = fileBuffer;

  if (IMAGE_EXTS.has(ext)) {
    const result = await optimizeImage(fileBuffer);
    if (result) {
      finalBuffer = result.buffer;
      ext = result.ext; // .webp
    }
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const relativePath = `${folder}/${filename}`;
  const fullDir = path.join(VPS_UPLOAD_DIR, folder);
  const fullPath = path.join(fullDir, filename);

  await fs.mkdir(fullDir, { recursive: true });
  await fs.writeFile(fullPath, finalBuffer);

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
