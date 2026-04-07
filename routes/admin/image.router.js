import express from "express";
import dotenv from "dotenv";

import { protect } from "../../middlewares/auth.middleware.js";
import { checkRole } from "../../middlewares/checkRole.js";
import {
  createImages,
  deleteImage,
  updateIsShowImage,
  updateImage,
} from "../../controllers/image.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";
dotenv.config();
const router = express.Router();

router.post(
  "/create",
  protect,
  checkRole("admin"),
  upload.fields([{ name: "images", maxCount: 100 }]),
  createImages,
);
router.patch("/update/:imageId", protect, checkRole("admin"), updateImage);
router.delete("/delete", protect, checkRole("admin"), deleteImage);
router.post(
  "/update-show/:imageId",
  protect,
  checkRole("admin"),
  updateIsShowImage,
);
export default router;
