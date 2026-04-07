import express from "express";
import dotenv from "dotenv";
import {
  getDetailImage,
  getListImage,
} from "../../controllers/image.controller.js";
dotenv.config();
const router = express.Router();

router.get("/detail/:imageId", getDetailImage);
router.get("/get-list", getListImage);
export default router;
