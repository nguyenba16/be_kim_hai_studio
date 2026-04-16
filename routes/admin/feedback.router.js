import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { checkRole } from "../../middlewares/checkRole.js";
import { upload } from "../../middlewares/upload.middleware.js";
import {
  createFeedback,
  updateFeedback,
  deleteFeedbacks,
  getListFeedbackAdmin,
  updateIsShowFeedback,
} from "../../controllers/feedback.controller.js";

const router = express.Router();

router.get("/get-list", protect, checkRole("admin"), getListFeedbackAdmin);

router.post(
  "/create",
  protect,
  checkRole("admin"),
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "proof_image", maxCount: 1 },
  ]),
  createFeedback,
);

router.patch(
  "/update/:feedbackId",
  protect,
  checkRole("admin"),
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "proof_image", maxCount: 1 },
  ]),
  updateFeedback,
);

router.delete("/delete", protect, checkRole("admin"), deleteFeedbacks);

router.post(
  "/update-show/:feedbackId",
  protect,
  checkRole("admin"),
  updateIsShowFeedback,
);

export default router;
