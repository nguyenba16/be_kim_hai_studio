import express from "express";
import { getListFeedbackCustomer } from "../../controllers/feedback.controller.js";

const router = express.Router();

router.get("/get-list", getListFeedbackCustomer);

export default router;
