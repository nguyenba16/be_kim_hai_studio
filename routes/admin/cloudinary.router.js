import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { checkRole } from "../../middlewares/checkRole.js";
import {
  getUploadSignature,
  deleteCloudinaryImage,
} from "../../controllers/cloudinary.controller.js";

const router = express.Router();

router.get("/signature", protect, checkRole("admin"), getUploadSignature);
router.delete("/delete", protect, checkRole("admin"), deleteCloudinaryImage);

export default router;
