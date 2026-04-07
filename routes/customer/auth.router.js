import express from "express";
import dotenv from "dotenv";
import {
  signin,
  refreshToken,
  signupAccount,
} from "../../controllers/auth.controller.js";
dotenv.config();
const router = express.Router();
router.post("/register", signupAccount);
router.post("/signin", signin);
router.post("/refresh-token", refreshToken);
export default router;
