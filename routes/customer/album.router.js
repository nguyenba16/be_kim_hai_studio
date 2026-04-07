import express from "express";
import dotenv from "dotenv";
import {
  getDetailAlbum,
  getListAlbum,
  getListAlbumAll,
} from "../../controllers/album.controller.js";
dotenv.config();
const router = express.Router();

router.get("/detail/:id", getDetailAlbum);
router.get("/get-list", getListAlbum);
router.get("/get-all", getListAlbumAll);
export default router;
