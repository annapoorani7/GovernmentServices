import express from "express";
import { getBhashiniStatus, translate } from "../controllers/bhashiniController.js";

const router = express.Router();

router.get("/status", getBhashiniStatus);
router.post("/translate", translate);

export default router;
