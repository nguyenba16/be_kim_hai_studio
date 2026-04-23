import express from "express";
import dotenv from "dotenv";
import { protect } from "../../middlewares/auth.middleware.js";
import { checkRole } from "../../middlewares/checkRole.js";
import { upload } from "../../middlewares/upload.middleware.js";
import {
  createAlbum,
  updateAlbum,
  deleteAlbum,
  updateIsOutstanding,
  updateIsShow,
} from "../../controllers/album.controller.js";
dotenv.config();
const router = express.Router();

router.post(
  "/create",
  protect,
  checkRole("admin"),
  upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "images", maxCount: 50 },
  ]),
  createAlbum,
);
router.patch(
  "/edit/:albumId",
  protect,
  checkRole("admin"),
  upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "images", maxCount: 30 },
  ]),
  updateAlbum,
);

router.delete("/delete-list", protect, checkRole("admin"), deleteAlbum);
router.post(
  "/update-outstanding/:albumId",
  protect,
  checkRole("admin"),
  updateIsOutstanding,
);
router.post("/update-show/:albumId", protect, checkRole("admin"), updateIsShow);
// router.post("/update-show/:albumId", protect, checkRole("admin"), updateIsShow);
// router.post(
//   "/update-outstanding/:albumId",
//   protect,
//   checkRole("admin"),
//   updateIsOutstanding,
// );

export default router;
