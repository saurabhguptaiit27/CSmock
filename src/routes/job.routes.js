import { Router } from "express";
import {
  createJob,
  getALLJobs,
  deleteJob,
  saveJob,
  unSaveJob,
  applyJob,
} from "../controllers/job.controller.js";
import { createrVerifyJWT } from "../middlewares/createrauth.middleware.js";

const router = Router();

router.route("/createjob").post(createrVerifyJWT, createJob);
router.route("/getalljobs").get(getALLJobs);
router.route("/deletejob").post(createrVerifyJWT, deleteJob);
router.route("/savejob").post(createrVerifyJWT, saveJob);
router.route("/unsavejob").post(createrVerifyJWT, unSaveJob);
router.route("/applyjob").post(createrVerifyJWT, applyJob);

export default router;
