import express from "express";
import dotenv from "dotenv";
import {
  getDetailVideo,
  getListVideo,
  getListVideoAll,
} from "../../controllers/video.controller.js";
dotenv.config();
const router = express.Router();

router.get("/detail/:videoId", getDetailVideo);
router.get("/get-list", getListVideo);
router.get("/get-all", getListVideoAll);
export default router;
