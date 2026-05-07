import express from "express";
import multer from "multer";
import { protect } from "../../middlewares/auth.middleware.js";
import { checkRole } from "../../middlewares/checkRole.js";
import { uploadFile, deleteFile } from "../../controllers/upload.controller.js";

const router = express.Router();

// Multer cho ảnh (10MB) và video thumbnail (10MB)
// Video file lớn dùng limit 100MB riêng
const uploadSingle = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB cho video
});

router.post(
  "/",
  protect,
  checkRole("admin"),
  uploadSingle.single("file"),
  uploadFile,
);

router.delete("/", protect, checkRole("admin"), deleteFile);

export default router;
