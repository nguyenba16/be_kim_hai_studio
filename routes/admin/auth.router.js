import express from "express";
import dotenv from "dotenv";

import { protect } from "../../middlewares/auth.middleware.js";
import { logout, getMe } from "../../controllers/auth.controller.js";
dotenv.config();
const router = express.Router();

router.post("/logout", protect, logout);
router.get("/get-me", protect, getMe);
export default router;
