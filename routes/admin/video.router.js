import express from "express";
import dotenv from "dotenv";

import { protect } from "../../middlewares/auth.middleware.js";
import { checkRole } from "../../middlewares/checkRole.js";
import { upload } from "../../middlewares/upload.middleware.js";
import {
  createVideo,
  deleteVideo,
  updateIsShowVideo,
  updateVideo,
  updateIsOutstandingVideo,
} from "../../controllers/video.controller.js";
dotenv.config();
const router = express.Router();

router.post(
  "/create",
  protect,
  checkRole("admin"),
  upload.fields([{ name: "cover_image", maxCount: 1 }]),
  createVideo,
);
router.patch(
  "/update/:videoId",
  protect,
  checkRole("admin"),
  upload.fields([{ name: "cover_image", maxCount: 1 }]),
  updateVideo,
);
router.delete("/delete", protect, checkRole("admin"), deleteVideo);
router.post(
  "/update-show/:videoId",
  protect,
  checkRole("admin"),
  updateIsShowVideo,
);
router.post(
  "/update-outstanding/:videoId",
  protect,
  checkRole("admin"),
  updateIsOutstandingVideo,
);
export default router;
