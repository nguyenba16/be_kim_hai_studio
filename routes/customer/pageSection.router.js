import express from "express";
import {
  getPageSectionByKey,
  getPageSectionsByPage,
} from "../../controllers/pageSection.controller.js";

const router = express.Router();

router.get("/get-by-key", getPageSectionByKey);
router.get("/get-by-page", getPageSectionsByPage);

export default router;
