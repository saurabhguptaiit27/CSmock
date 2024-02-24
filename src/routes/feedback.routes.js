import { Router } from "express";
import { giveFeedback } from "../controllers/feedback.controller.js";

const router = Router();


router.route("/givefeedback").post(giveFeedback);

export default router;