import express from "express";
import dotenv from "dotenv";
import { protect } from "../../middlewares/auth.middleware.js";
import { checkRole } from "../../middlewares/checkRole.js";
import { upload } from "../../middlewares/upload.middleware.js";
import {
  getAllPageSectionsAdmin,
  upsertPageSection,
  deletePageSection,
} from "../../controllers/pageSection.controller.js";

dotenv.config();
const router = express.Router();

router.get("/get-all", protect, checkRole("admin"), getAllPageSectionsAdmin);

router.post(
  "/upsert",
  protect,
  checkRole("admin"),
  upload.fields([{ name: "banner_image", maxCount: 1 }]),
  upsertPageSection,
);

router.delete("/delete/:id", protect, checkRole("admin"), deletePageSection);

export default router;
