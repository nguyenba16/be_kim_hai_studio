import express from "express";
import dotenv from "dotenv";
import { protect } from "../../middlewares/auth.middleware.js";
import { checkRole } from "../../middlewares/checkRole.js";
import { upload } from "../../middlewares/upload.middleware.js";
import {
  createService,
  updateService,
  deleteService,
  updateIsShowService,
} from "../../controllers/service.controller.js";

dotenv.config();
const router = express.Router();
router.post(
  "/create",
  protect,
  checkRole("admin"),
  upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "images", maxCount: 30 },
  ]),
  createService,
);
router.patch(
  "/edit/:serviceId",
  protect,
  checkRole("admin"),
  upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "images", maxCount: 30 },
  ]),
  updateService,
);
router.delete("/delete-list", protect, checkRole("admin"), deleteService);
router.post(
  "/update-show/:serviceId",
  protect,
  checkRole("admin"),
  updateIsShowService,
);

export default router;
