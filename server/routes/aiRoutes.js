import express from "express";
import { assist } from "../controllers/aiController.js";

const router = express.Router();

router.post("/assist", assist);

export default router;