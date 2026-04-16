import express from "express";
import dotenv from "dotenv";

import {
  getDetailService,
  getListService,
  getDetailServiceBySlug,
} from "../../controllers/service.controller.js";

dotenv.config();
const router = express.Router();

router.get("/detail/:id", getDetailService);
router.get("/get-list", getListService);
router.get("/detail-slug/:slug", getDetailServiceBySlug);
router.get("/get-all", async (req, res) => {
  try {
    const { isShow } = req.query;

    const filter = {};
    if (isShow !== undefined) filter.isShow = isShow === "true";

    const services = await Service.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: services,
      total: services.length,
    });
  } catch (error) {
    console.error("getAllService error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
