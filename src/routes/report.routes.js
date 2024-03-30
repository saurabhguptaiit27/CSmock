import { Router } from "express";
import { giveReport, getReport } from "../controllers/report.controller.js";

const router = Router();

router.route("/givereport").post(giveReport);

router.route("/getreport").post(getReport);

export default router;
