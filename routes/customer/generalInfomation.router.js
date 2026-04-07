import express from "express";
import dotenv from "dotenv";
import { getGeneralInformation } from "../../controllers/generalInfomation.controller.js";
dotenv.config();
const router = express.Router();
router.get("/get-detail", getGeneralInformation);

export default router;
