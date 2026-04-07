import express from "express";
import dotenv from "dotenv";
import { protect } from "../../middlewares/auth.middleware.js";
import { checkRole } from "../../middlewares/checkRole.js";
import {
  createGeneralInformation,
  updateGeneralInformation,
} from "../../controllers/generalInfomation.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";

dotenv.config();
const router = express.Router();

router.post(
  "/create",
  protect,
  checkRole("admin"),
  upload.fields([
    { name: "logo_image", maxCount: 1 },
    { name: "personal_image", maxCount: 3 },
  ]),
  createGeneralInformation,
);
router.patch(
  "/edit",
  protect,
  checkRole("admin"),
  upload.fields([
    { name: "logo_image", maxCount: 1 },
    { name: "personal_image", maxCount: 3 },
  ]),
  updateGeneralInformation,
);

export default router;
