import express from "express";
import dotenv from "dotenv";
import { protect } from "../../middlewares/auth.middleware.js";
import { checkRole } from "../../middlewares/checkRole.js";
import {
  createGeneralInformation,
  updateGeneralInformation,
} from "../../controllers/generalInfomation.controller.js";

dotenv.config();
const router = express.Router();

router.post("/create", protect, checkRole("admin"), createGeneralInformation);
router.patch("/edit", protect, checkRole("admin"), updateGeneralInformation);

export default router;
